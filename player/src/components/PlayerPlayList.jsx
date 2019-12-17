import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Slide,
    Toolbar,
    Typography,
    AppBar
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import {
    NavigateBeforeRounded as BackIcon,
    GetAppRounded as DownloadIcon
} from '@material-ui/icons'
import { observer } from 'mobx-react'
import memoize from 'memoize-one'

@observer
class PlayerPlayList extends Component {

    constructor(props, context) {
        super(props, context)

        const { device: { playlist: { files }, currentFileIndex } } = props
        let path = files[currentFileIndex].path

        path = path ? path.split('/') : []

        this.state = { path }
    }


    hundleBack = () => {
        this.setState(({ path }) => {
            path.pop()
            return { path }
        })
    }

    hundleSelect = (file) => {
        if (file.files) {
            this.setState(({ path }) => {
                path.push(file.id)
                return { path }
            })
        } else {
            const { device: { playlist: { files } }, onFileSelected } = this.props
            onFileSelected(files.findIndex(({ id }) => id == file.id))
        }
    }

    handleTrackDownload = (file) => {
        const { device: { playlist: { title } } } = this.props

        window.gtag && gtag('event', 'downloadFile', {
            'event_category': 'link',
            'event_label': `${title} - ${file.name}`
        })
    }


    getTreeNode = (root, path) => {
        let node = root

        path.forEach((part) => {
            let child = node.files.find(
                ({ id }) => id == part
            )
            node = child
        })

        return node
    }

    getTree = memoize(({ title, files }) => {
        const root = {
            name: title,
            files: []
        }

        const getNode = (path) => {
            let node = root

            path.forEach((part) => {
                let child = node.files.find(
                    ({ id }) => id == part
                )

                if (child == null) {
                    child = {
                        id: part,
                        name: part,
                        files: []
                    }
                    node.files.push(child)
                }

                node = child
            })

            return node
        }

        files.forEach((file) => {
            const path = file.path ? file.path.split('/') : []
            const node = getNode(path)

            node.files.push(file)
        })

        return root
    })

    renderDownload(file) {
        if (!file.files) {
            const downloadUrl = file.extractor ? null : file.url
            if (downloadUrl)
                return (
                    <ListItemSecondaryAction>
                        <IconButton
                            component='a'
                            href={downloadUrl}
                            download={downloadUrl}
                            target="_blank"
                            onClick={() => this.handleTrackDownload(file)}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                )
        }
    }

    render() {
        const { path } = this.state
        const { device: { playlist, currentFileIndex }, open } = this.props
        const { files } = playlist

        const tree = this.getTree(playlist)
        const node = this.getTreeNode(tree, path)

        //create current path
        let currentPath = files[currentFileIndex].path
        const currentFileId = files[currentFileIndex].id
        currentPath = currentPath ? currentPath.split('/') : []
        const selectedIds = currentPath.concat(currentFileId)

        return (
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Paper elevation={12} square className="player__file-list">
                    {path.length != 0 &&
                        <AppBar position="static" color='secondary'>
                            <Toolbar>
                                <IconButton edge="start" onClick={this.hundleBack}>
                                    <BackIcon />
                                </IconButton>
                                <Typography variant="h6">
                                    {path.join(' / ')}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    }
                    <List>
                        {node.files.map((file) => (
                            <ListItem
                                button
                                key={file.id}
                                selected={selectedIds.indexOf(file.id) != -1}
                                onClick={() => this.hundleSelect(file)}
                            >
                                <ListItemText primary={
                                    <span style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                                        {file.name}
                                    </span>
                                } />
                                {this.renderDownload(file)}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Slide>
        )
    }

    // getGroups = memoize(fileGroupingFun)
    // getFileGroup = memoize((fileId, groups) =>
    //     groups.find((g) =>
    //         g.files.find((f) => f.id == fileId) != null
    //     )
    // )

    // renderFiles(groupFiles, currentFileId, files) {
    //     const { onFileSelected } = this.props

    //     return groupFiles.map((file) => {
    //         const style = currentFileId == file.id ? { background: grey[600] } : {}
    //         const downloadUrl = file.extractor ? null : file.url

    //         return (
    //             <ListItem
    //                 button
    //                 key={file.id}
    //                 style={style}
    //                 onClick={() => onFileSelected(files.findIndex(({ id }) => id == file.id))}>
    //                 <ListItemText primary={
    //                     <span style={{ wordBreak: 'break-all' }}>
    //                         {file.name}
    //                     </span>
    //                 } />
    //                 {downloadUrl && <ListItemSecondaryAction>
    //                     <IconButton
    //                         component='a'
    //                         href={downloadUrl}
    //                         download={downloadUrl}
    //                         target="_blank"
    //                         onClick={() => this.handleTrackDownload(file)}
    //                     >
    //                         <DownloadIcon />
    //                     </IconButton>
    //                 </ListItemSecondaryAction>}
    //             </ListItem>
    //         )
    //     })
    // }

    // render() {
    //     let { selectedGroup, selectGroup } = this.state
    //     const { device: { playlist, currentFileIndex }, open } = this.props
    //     const { files } = playlist

    //     const groups = this.getGroups(files)

    //     const currentFileId = files[currentFileIndex].id
    //     const currentGroup = this.getFileGroup(currentFileId, groups)
    //     selectedGroup = selectedGroup || currentGroup

    //     const groupFiles = groups.length > 1 ? selectedGroup.files : files

    //     return (
    //         <Slide direction="left" in={open} mountOnEnter unmountOnExit>
    //             <Paper elevation={12} square className="player__file-list">
    //                 <List>
    //                     {!selectGroup && <Fragment>
    //                         {groups.length > 1 &&
    //                             <AppBar position="static" color='secondary'>
    //                                 <Toolbar>
    //                                     <IconButton edge="start"  onClick={this.handleOpenGroupsMenu}>
    //                                         <BackIcon />
    //                                     </IconButton>
    //                                     <Typography variant="h6">
    //                                         {selectedGroup.name}
    //                                     </Typography>
    //                                 </Toolbar>
    //                             </AppBar>
    //                         }
    //                         {this.renderFiles(groupFiles, currentFileId, files)}
    //                     </Fragment>}
    //                     {selectGroup && groups.map((group) => (
    //                         <ListItem
    //                             button
    //                             key={group.name}
    //                             style={group.name == selectedGroup.name ? { background: grey[600] } : {}}
    //                             onClick={() => this.handleSelectGroup(group)}>
    //                             <ListItemText primary={
    //                                 <span style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
    //                                     {group.name}
    //                                 </span>
    //                             } />
    //                         </ListItem>
    //                     ))}
    //                 </List>
    //             </Paper>
    //         </Slide>
    //     )
    // }
}

PlayerPlayList.propTypes = {
    device: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onFileSelected: PropTypes.func.isRequired
}

export default PlayerPlayList