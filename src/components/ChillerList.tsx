import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { DetailDialog } from "./DetailDialog";
import { Chiller } from "./commonInterfaces";

export const ChillerList = (props: { chillerData: Chiller[] }) => {
    const { chillerData } = props
    const [selectedChiller, setSelectedChiller] = useState<Chiller | null>(null)
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            {chillerData.map((chiller) => {
                return (
                    <div key={chiller.name}>
                        <Button onClick={() => { setSelectedChiller(chiller); handleClickOpen() }}>
                            <Typography color={chiller.active ? '#000' : '#999'}>
                                {chiller.name}
                            </Typography>
                        </Button>

                    </div>
                )
            })}
            <DetailDialog
                selectedValue={selectedChiller}
                open={open}
                onClose={handleClose}
            />
        </>
    )

}