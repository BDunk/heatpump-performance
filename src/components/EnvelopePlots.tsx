import { Dispatch, SetStateAction, useState } from "react";
import { Chiller, XYArray } from "./commonInterfaces";
import { Button } from "@mui/material";
import React from "react";
import Plot from "react-plotly.js";
import robustPointInPolygon from "robust-point-in-polygon";
import { colorFromString } from "./commonFunctions";

const getGrid = () => {
    var x_data: number[] = []
    var y_data: number[] = []

    for (let i = 70; i < 150; i++) {
        for (let j = -30; j < 120; j++) {
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

    const handleClick = (event: Plotly.PlotMouseEvent) => {
        const point = event.points[0];
        const x = point.x
        const y = point.y
        if (typeof x == "number" && typeof y == "number") {
            setPoints({ "x": [...points.x, x], "y": [...points.y, y] })
            let temp = chillerData
            setChillerData(temp.map((chiller) => {
                var polygon: [number, number][] = []
                for (var ii = 0; ii < chiller.envelope.x.length; ii++) {
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
                data={([
                    ...chillerTraces,
                    {
                        x: grid.x,
                        y: grid.y,
                        type: 'scatter',
                        hoverinfo: 'text',
                        mode: 'none',
                        showlegend: false
                    },
                    {
                        x: points.x,
                        y: points.y,
                        type: 'scatter',
                        hoverinfo: 'text',
                        mode: 'points',
                        showlegend: false,
                        stroke: 'rgba(0,0,0,0)'
                    }
                ]) as Plotly.Data[]}
                layout={{
                    xaxis: {
                        range: [70, 150]
                    },
                    yaxis: {
                        range: [-30, 120]
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