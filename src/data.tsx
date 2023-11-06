export const DATA = [
    {
        "name": "York YMAE",
        "envelope": {
            "x": [75, 120, 130, 130, 140, 140, 120, 75, 75],
            "y": [-20, -20, 0, 20, 30, 80, 110, 110, -20]
        },
        "performance": [
            {
                "name": "Q",
                "values": {
                    "x": [-2, -1, 0, 1, 2],
                    "y": [-20, -10, 0, 10, 20]
                }
            },
            {
                "name": "COP",
                "values": {
                    "x": [-2, -1, 0, 1, 2],
                    "y": [1, 2, 3, 4, 5]
                }
            },
            {
                "name": "P",
                "values": {
                    "x": [-2, -1, 0, 1, 2],
                    "y": [1, 2, 3, 2, 1]
                }
            },
        ],
        "active": true
    },
    {
        "name": "Aermec NYK",
        "envelope": {
            "x": [70, 115, 125, 125, 135, 135, 115, 70, 70],
            "y": [-25, -25, -5, 15, 25, 75, 105, 105, -25]
        },
        "performance": [
            {
                "name": "Q",
                "values": {
                    "x": [-2, -1, 0, 1, 2],
                    "y": [-30, -5, 0, 10, 20]
                }
            },
            {
                "name": "COP",
                "values": {
                    "x": [-2, -1, 0, 1, 2],
                    "y": [1, 2, 4, 4, 8]
                }
            },
            {
                "name": "P",
                "values": {
                    "x": [-2, -1, 0, 1, 2],
                    "y": [1, 2, 6, 2, 1]
                }
            },
        ],

        "active": true
    }
]

export var x_data: number[] = []
export var y_data: number[] = []

for (let i = 70; i < 150; i++) {
    for (let j = -30; j < 120; j++) {
        x_data = [...x_data, i]
        y_data = [...y_data, j]
    }
}