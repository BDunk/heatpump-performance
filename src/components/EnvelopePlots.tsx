import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Chiller, XYArray } from "./commonInterfaces";
import { Button } from "@mui/material";
import Plot from "react-plotly.js";
import robustPointInPolygon from "robust-point-in-polygon";
import { colorFromString } from "./commonFunctions";
import { DetailDialog } from "./DetailDialog";

const getGrid = () => {
    let x_data: number[] = []
    let y_data: number[] = []

    for (let i = -20; i < 120; i=i+2) {
        for (let j = 65; j < 145; j=j+2) {
            x_data = [...x_data, i]
            y_data = [...y_data, j]
        }
    }
    return { "x": x_data, "y": y_data }
}

interface EnvelopePlotsProps {
    chillerData: Chiller[],
    setChillerData: Dispatch<SetStateAction<Chiller[]>>
}

export const EnvelopePlots = (props: EnvelopePlotsProps) => {
    const { chillerData, setChillerData } = props;
    const [points, setPoints] = useState<XYArray>({ "x": [], "y": [] });
    const [grid,] = useState<XYArray>(getGrid())
    const [rev, setRev] =useState<number>(0)
    const [selectedChiller, setSelectedChiller] = useState<Chiller | null>(null)
    const [open, setOpen] = useState(false);

    const resetActive = () => {
        setPoints({ "x": [], "y": [] })
        setChillerData(chillerData.map((chiller) => {
            chiller.active = true
            return chiller
        }))
    }

    const chillerTraces = chillerData.filter((chiller) => {
        return chiller.active
    }).map((chiller) => {
        return {
            x: chiller['envelope']['x'],
            y: chiller['envelope']['y'],
            fill: 'toself',
            fillcolor: colorFromString(chiller['name'], 0.5),
            hoveron: 'fill+points',
            line: {
                color: colorFromString(chiller['name'], 1)
            },
            marker: {
                color: colorFromString(chiller['name'], 1)
            },
            hoverinfo: 'name+x+y',
            name: chiller['name'],
        }
    })

    const handleClick = (event: Plotly.PlotMouseEvent) => {
        const point = event.points[0];
        const x = point.x
        const y = point.y
        if (typeof x == "number" && typeof y == "number") {
            
            if(point.curveNumber <= chillerTraces.length-1){
                setSelectedChiller(chillerData[point.curveNumber]); 
                handleClickOpen()
            }
            else{
                const temp_points = {...points}
                if (point.curveNumber === chillerTraces.length + 1){
                    temp_points.x.push(x)
                    temp_points.y.push(y)
                    
                }
                else if (point.curveNumber === chillerTraces.length ){
                    temp_points.x.splice(point.pointNumber,1)
                    temp_points.y.splice(point.pointNumber,1)
                }
                setPoints(temp_points)
            
                
                const temp_chillers = chillerData

                setChillerData(temp_chillers.map((chiller) => {
                    let polygon: [number, number][] = []
                    for (let ii = 0; ii < chiller.envelope.x.length; ii++) {
                        polygon = [...polygon, [chiller.envelope.x[ii], chiller.envelope.y[ii]]]
                    }
                    chiller.active = true
                    for (let ii =0; ii<temp_points.x.length; ii++){
                        if (robustPointInPolygon(polygon, [x, y]) === 1) {
                            chiller.active = false
                        }
                    }
                    return chiller
                }))
                }
            }
    }

    useEffect(()=>{
        setRev(rev+1)
        console.log(rev+1)
    },[points])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>              
            <Plot
                style={{ width: '100%', height: '80%' }}
                useResizeHandler={true}
                data={([
                    ...chillerTraces,
                    {
                        x: points.x,
                        y: points.y,
                        type: 'scatter',
                        mode: 'markers',
                        showlegend: false,
                        marker: {
                            color: 'rgb(219, 64, 82)',
                            size: 5
                          },
                        name: 'Required Point',
                        hoverinfo: 'name+x+y',
                    },
                    {
                        x: grid.x,
                        y: grid.y,
                        type: 'scatter',
                        mode: 'none',
                        showlegend: false,
                        hoverinfo: 'x+y',
                    },
                    
                ]) as Plotly.Data[]}
                layout={{
                    xaxis: {
                        range: [-20, 120],
                        title:{
                            text:"T_amb (degF)"
                        }
                    },
                    yaxis: {
                        range: [65, 145],
                        title:{
                            text:"T_cond (degF)"
                        }
                    },
                    legend: {
                        itemclick: false,
                        itemdoubleclick: false
                    },
                    datarevision: rev
                }}
                onClick={handleClick}
            />
            <Button onClick={resetActive}>
                Clear Selected Points
            </Button>
            <DetailDialog
                selectedValue={selectedChiller}
                open={open}
                onClose={handleClose}
            />
        </>
    )

}