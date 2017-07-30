{
    "frame": {
        "width": 32,
        "height": 32,
        "cols": 6,
        "rows": 3
    },
    "animations" : {
        "start": {
            "frames": [0,1,2,3],
            "next": "start2",
            "frequency": 5
        },
        "start2": {
            "frames": [9,10,11,15,16,17],
            "next": "start2",
            "frequency": 5
        }
    }
}