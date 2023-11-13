import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Plot from 'react-plotly.js'
import { Typography } from '@mui/material'
import { Chiller } from './commonInterfaces'
import { useEffect, useState } from 'react';
import { colorFromString } from './commonFunctions';

interface DialogProps {
    selectedValue: Chiller[],
    open: boolean,
    onClose: () => void,
}

export const DetailDialog = (props: DialogProps) => {
    const { selectedValue, open, onClose } = props;
    const [data, setData] = useState<{name:string, values:Plotly.Data[]}[]>()

    const handleClose = () => {
        onClose();
    };

    useEffect(()=>{
        const plots: {name:string, values:Plotly.Data[]}[] = []
        if (selectedValue.length>0){
            Object.keys(selectedValue[0].performance).forEach((_key, index)=>{
                const plot = {
                    name: selectedValue[0].performance[index].name,
                    values: selectedValue.map((chiller)=>
                    {
                        return {
                            x: chiller.performance[index].values.x,
                            y: chiller.performance[index].values.y,
                            type: 'scatter',
                            line: {
                                color: colorFromString(chiller['name'], 1)
                            },
                            marker: {
                                color: colorFromString(chiller['name'], 1)
                            },
                            name: chiller['name'],
                            hoverinfo: 'x+y+name',
                        } as Plotly.Data
                    })
                }
                plots.push(plot)
            }
            )
        }
        setData(plots)

    }, [selectedValue])

    return (
        <Dialog onClose={handleClose} open={open} fullScreen>
            {selectedValue.length > 0 &&
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
                        Details
                    </DialogTitle>

                    <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flex: 1 }}>

                        <Typography>
                        </Typography>
                        {data && data.map((value) => {
                            return (
                                <div style={{ flex: 0.5 }} key={value.name}>
                                    <Plot data={value.values}
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