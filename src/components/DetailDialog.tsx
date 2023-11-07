import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Plot from 'react-plotly.js'
import { Typography } from '@mui/material'
import { Chiller } from './commonInterfaces'

interface DialogProps {
    selectedValue: Chiller | null,
    open: boolean,
    onClose: () => void,
}

export const DetailDialog = (props: DialogProps) => {
    const { selectedValue, open, onClose } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} fullScreen>
            {selectedValue &&
                <>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogTitle>
                        {selectedValue.name}
                    </DialogTitle>

                    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>

                        <Typography>
                        </Typography>
                        {selectedValue.performance.map((value) => {
                            return (
                                <div style={{ flex: 1 }} key={value.name}>
                                    <Plot data={[{
                                        x: value.values.x,
                                        y: value.values.y,
                                        type: 'scatter',
                                        hoverinfo: 'text',
                                        showlegend: false
                                    }]}
                                        layout={{
                                            title: value.name
                                        }} />
                                </div>
                            )
                        })}
                    </div>
                </>
            }
        </Dialog>
    );
}