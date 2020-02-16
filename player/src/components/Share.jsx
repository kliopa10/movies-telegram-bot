import React from 'react'
import PropTypes from 'prop-types'
import BaseSelector from './BaseSelector'
import copy from 'clipboard-copy'
import {
    IconButton,
    Typography,
    FormGroup,
    FormControlLabel,
    Switch
} from '@material-ui/core'
import {
    ShareRounded as ShareIcon,
    FileCopyRounded as CopyIcon
} from '@material-ui/icons'
import { inject } from 'mobx-react'

import analytics from '../utils/analytics'
import store from '../utils/storage'


@inject(({ notificationStore: { showMessage }}) => ({ showMessage }))
class Share extends BaseSelector {

    constructor(props, context) {
        super(props, context)

        this.state.sharePosition = true
        this.state.shareTime = false
    }

    toggleSharePosition = () => this.setState(({ sharePosition }) => ({ sharePosition: !sharePosition }))
    toggleShareTime = () => this.setState(({ shareTime }) => ({ shareTime: !shareTime }))

    renderButton() {
        return (
            <IconButton onClick={this.handleClick}>
                <ShareIcon />
            </IconButton>
        )
    }

    getShareUrl = (sharePosition, shareTime) => {
        const { device: { currentTime, currentFileIndex } } = this.props

        const params = new URLSearchParams(location.search);

        ['provider', 'id'].forEach((k) => {
            if (!params.has(k)) {
                params.set(k, store.get(k))
            }
        })

        if (sharePosition) {
            params.set('file', currentFileIndex)

            if (shareTime) {
                params.set('time', Math.floor(currentTime))
            }
        }

        return encodeURIComponent(location.protocol + '//' + location.host + '/?' + params.toString())
    }

    getTitle = (sharePosition) => {
        if (sharePosition) {
            return encodeURIComponent(document.title)
        } else {
            const { device: { playlist: { title } } } = this.props
            return encodeURIComponent(title)
        }
    }

    handleShare = (network) => {
        analytics(network, 'share', document.title)
    }

    handleCopy = (url) => {
        copy(decodeURIComponent(url))
        this.props.showMessage('URL copied!')
    }

    renderList() {
        const { sharePosition, shareTime } = this.state
        const url = this.getShareUrl(sharePosition, shareTime)
        const title = this.getTitle(sharePosition)

        return (
            <div className="player__share-content">
                <Typography>
                    Share with...
                </Typography>
                <div>
                    <a className="icon-vkontakte"
                        href={`http://vk.com/share.php?url=${url}&title=${title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => this.handleShare('vk')}
                    />
                    <a className="icon-telegram"
                        href={`https://telegram.me/share/url?url=${url}&text=${title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => this.handleShare('telegram')}
                    />
                    <a className="icon-facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => this.handleShare('facebook')}
                    />
                    <a className="icon-viber"
                        href={`viber://forward?text=${title}%20$${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => this.handleShare('viber')}
                    />
                    <a className="icon-whatsapp"
                        href={`whatsapp://send?text=${title}%20$${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => this.handleShare('whatsapp')}
                    />
                    <a className="icon-twitter"
                        href={`https://twitter.com/intent/tweet?text=${title}%20${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => this.handleShare('twitter')}
                    />
                    <a className="icon-copy" onClick={() => this.handleCopy(url)}>
                        <CopyIcon />
                    </a>
                </div>
                <div>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={sharePosition}
                                    onChange={this.toggleSharePosition}
                                    color="primary"
                                />
                            }
                            label="Current playlist position"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={shareTime}
                                    onChange={this.toggleShareTime}
                                    color="primary"
                                />
                            }
                            label="Current time"
                        />
                    </FormGroup>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="player__share">
                {super.render()}
            </div>
        )
    }
}

Share.propTypes = {
    showMessage: PropTypes.func,
    device: PropTypes.any
}

export default Share 