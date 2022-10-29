import React from 'react'
import {
  VolumeUpRounded as VolumeUpIcon,
  VolumeOffRounded as VolumeOffIcon
} from '@material-ui/icons'
import {
  Slider,
  IconButton,
  Tooltip
} from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import localization from '../localization'

export default observer(({ device }) => {
  const { volume, isMuted } = device

  const handleToggleMute = () => {
    device.toggleMute()
  }

  const handleVolume = (_, volume) => {
    device.setVolume(volume / 100)
    device.setMute(false)
  }

  return (
    <>
      <Slider className="sound-control__slider " value={volume * 100} onChange={handleVolume} />
      <Tooltip title={localization.formatString(localization.hotkey, 'M')}>
        <IconButton onClick={handleToggleMute}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Tooltip>
    </>
  )
})
