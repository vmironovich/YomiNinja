import { Box, Typography } from "@mui/material";
import { SettingsContext } from "../../context/settings.provider";
import { useContext } from "react";
import CloudVisionSettings from "./OcrSettings/CloudVisionSettings";
import { CloudVisionOcrEngineSettings } from "../../../electron-src/@core/infra/ocr/cloud_vision_ocr.adapter/cloud_vision_ocr_settings";


// Settings section component
export default function AppSettingsOcrEngine() {

    const { activeSettingsPreset } = useContext( SettingsContext );

    const cloudVisionSettings = activeSettingsPreset?.ocr_engines
        .find( item => item.ocr_adapter_name === 'CloudVisionOcrAdapter' ) as CloudVisionOcrEngineSettings;

    return (
        <Box sx={{ flexGrow: 1, margin: 1, mt: 0 }}>

            <Typography gutterBottom variant="h6" component="div" ml={0} mb={3}>
                OCR Engine
            </Typography>

            <CloudVisionSettings ocrEngineSettings={cloudVisionSettings}/>

        </Box>

    )
}
