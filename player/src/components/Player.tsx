import React, { useCallback, useEffect, useRef, useState, MouseEvent } from 'react'

import fscreen from 'fscreen'

import MediaControls from './MediaControls'
import PlayerFilesList from './PlayerPlayList'
import PlayerTitle from './PlayerTitle'
import Video, { VideoApi } from './Video'
import PlayBackZones from './PlayBackZones'
import Share from './Share'
import { addGlobalKey, removeGlobalKey } from '../utils/globalKeys'

import { observer } from 'mobx-react-lite'

import { download, isTouchDevice, toHHMMSS } from '../utils'
import { playerStore } from '../store'
import Typography from '@mui/material/Typography'
import PictureInPicture from './PictureInPicture'

const IDLE_TIMEOUT = 10000

interface HandleActionListenerProps {
  idle: boolean
  onAction: () => void
  children: React.ReactNode
}

// eslint-disable-next-line react/display-name
const HandleActionListener = React.forwardRef<HTMLDivElement, HandleActionListenerProps>(({ idle, onAction, children }, ref) => {
  const handleClick = (e: MouseEvent): void => {
    if (idle) {
      e.preventDefault()
      e.stopPropagation()
      onAction()
    }
  }

  if (isTouchDevice()) {
    return (<div ref={ref} onClickCapture={handleClick} onTouchMoveCapture={onAction}>
      {children}
    </div>)
  } else {
    return (<div ref={ref} onMouseMove={onAction}>
      {children}
    </div>)
  }
})

interface Props {
  initialFullScreen: boolean
}

interface Self {
  idleTimeout?: NodeJS.Timeout
}

const Player: React.FC<Props> = ({ initialFullScreen }) => {
  const [self] = useState<Self>({})
  const [playlistOpen, setPlaylistOpen] = useState(false)
  const [idle, setIdle] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const videoRef = useRef<VideoApi>(null)

  const { device } = playerStore
  const { error } = device

  const handleTogglePlayList = useCallback(() => setPlaylistOpen((prev) => !prev), [])

  const handlePlayPause = useCallback((): void => {
    if (device.isPlaying) {
      device.pause()
    } else {
      device.play()
    }
  }, [device])

  useEffect(() => {
    addGlobalKey('Space', handlePlayPause)
  }, [handlePlayPause])

  const handleSeek = (time: number): void => device.seeking(time)

  const handleSeekEnd = (time: number): void => {
    device.seek(time)
  }

  // const handleIdle = (idle) => setIdle(idle)
  const handleSelectFile = (fileIndex: number): void => {
    playerStore.switchFile(fileIndex)
    if (isTouchDevice()) {
      setPlaylistOpen(false)
    }
  }

  const handleToggleFullscreen = useCallback(() => {
    if (fscreen.fullscreenEnabled && container.current != null) {
      if (fullScreen) {
        fscreen.exitFullscreen()
      } else {
        fscreen.requestFullscreen(container.current)
        setPlaylistOpen(false)
      }
    }
  }, [fullScreen])

  useEffect(
    () => addGlobalKey(['KeyF', 'Enter'], handleToggleFullscreen),
    [handleToggleFullscreen]
  )

  // --- idle checking ---
  const handleActivity = useCallback(() => {
    clearTimeout(self.idleTimeout)
    self.idleTimeout = setTimeout(() => setIdle(true), IDLE_TIMEOUT)
    setIdle(false)
  }, [self])

  useEffect(() => {
    self.idleTimeout = setTimeout(() => setIdle(true), IDLE_TIMEOUT)
    return () => clearTimeout(self.idleTimeout)
  }, [self])

  useEffect(() => {
    addGlobalKey(['KeyP'], () => {
      if (idle) {
        setPlaylistOpen(true)
        handleActivity()
      } else {
        handleTogglePlayList()
      }
    })
  }, [handleActivity, handleTogglePlayList, idle])

  useEffect(() => {
    addGlobalKey(['KeyM'], () => device.toggleMute())
  }, [device])

  useEffect(() => {
    const handleFullScreenChanged = (): void => {
      const fullScreen = fscreen.fullscreenElement !== null
      setFullScreen(fullScreen)
      if (fullScreen) {
        if (isTouchDevice() && screen.orientation) {
          screen.orientation.lock('landscape')
        }
        setIdle(true)
      }
    }

    fscreen.addEventListener('fullscreenchange', handleFullScreenChanged, false)
    if (fscreen.fullscreenEnabled && initialFullScreen && container.current != null) {
      fscreen.requestFullscreen(container.current)
    }

    return () => {
      fscreen.removeEventListener('fullscreenchange', handleFullScreenChanged)
    }
  }, [initialFullScreen])

  const takeScreanShot = useCallback(() => {
    if (videoRef.current) {
      device.pause()
      const image = videoRef.current.takeScreanShot()
      download(image, `${document.title}-${toHHMMSS(device.currentTime).replaceAll(':', '-')}`)
    }
  }, [device])

  useEffect(() => {
    addGlobalKey(['KeyT'], () => takeScreanShot())
  }, [takeScreanShot])

  useEffect(() => {
    addGlobalKey(['PageUp', 'BracketLeft'], () => playerStore.prevFile())
    addGlobalKey(['PageDown', 'BracketRight'], () => playerStore.nextFile())


    return () => {
      removeGlobalKey([
        'Space', 'Enter',
        'KeyF', 'KeyM', 'KeyP',
        'PageUp', 'PageDown',
        'BracketLeft', 'BracketRight',
        'KeyT'
      ])
    }
  }, [])

  const hideUi = error == null && idle && !playlistOpen

  return (
    <HandleActionListener idle={idle} onAction={handleActivity} ref={container}>
      <div id="player_root" className={hideUi ? 'idle' : ''}>
        {error && <Typography className="center" variant="h4">{error}</Typography>}
        {!error &&
          <PlayBackZones
            device={device}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onSeekEnd={handleSeekEnd} />}
        {(!error && device.source) && <Video device={device} onEnded={playerStore.fileEnd} ref={videoRef} />}
        {!hideUi && <>
          <PlayerTitle title={playerStore.getPlayerTitle()} />
          <Share device={device} playlist={device.playlist} />
          <PictureInPicture device={device} />
          <PlayerFilesList
            open={playlistOpen}
            device={device}
            onFileSelected={handleSelectFile} />
          <MediaControls
            fullScreen={fullScreen}
            device={device}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onSeekEnd={handleSeekEnd}
            onNext={playerStore.nextFile}
            onPrev={playerStore.prevFile}
            onPlaylistToggle={handleTogglePlayList}
            onFullScreenToggle={handleToggleFullscreen} />
        </>}
      </div>
    </HandleActionListener>
  )
}

export default observer(Player)
