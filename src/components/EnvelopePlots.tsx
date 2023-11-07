import { Dispatch, SetStateAction, useState } from "react";
import { Chiller, XYArray } from "./commonInterfaces";
import { Button } from "@mui/material";
import Plot from "react-plotly.js";
import robustPointInPolygon from "robust-point-in-polygon";
import { colorFromString } from "./commonFunctions";

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
            hoverinfo: 'name',
            name: chiller['name']
        }
    })

    //const handleHover = (event: Plotly.PlotMouseEvent) =>{
    //    console.log(event)
    //}

    const handleClick = (event: Plotly.PlotMouseEvent) => {
        const point = event.points[0];
        console.log(point)
        const x = point.x
        const y = point.y
        if (typeof x == "number" && typeof y == "number") {
            setPoints({ "x": [...points.x, x], "y": [...points.y, y] })
            const temp = chillerData
            setChillerData(temp.map((chiller) => {
                let polygon: [number, number][] = []
                for (let ii = 0; ii < chiller.envelope.x.length; ii++) {
                    polygon = [...polygon, [chiller.envelope.x[ii], chiller.envelope.y[ii]]]
                }
                if (robustPointInPolygon(polygon, [x, y]) === 1) {
                    chiller.active = false
                }
                return chiller
            }))
        }
    }

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
                        hoverinfo: 'text',
                        mode: 'markers',
                        showlegend: false,
                        marker: {
                            color: 'rgb(219, 64, 82)',
                            size: 5
                          }
                    },
                    {
                        x: grid.x,
                        y: grid.y,
                        type: 'scatter',
                        hoverinfo: 'text',
                        mode: 'none',
                        showlegend: false
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
                    }
                }}
                onClick={handleClick}
            />
            <Button onClick={resetActive}>
                Clear Selected Points
            </Button>
        </>
    )

}