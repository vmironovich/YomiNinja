import { Box, Container, FormControlLabel, FormGroup, MenuItem, Select, Switch, SxProps, TextField, Theme, Typography } from "@mui/material";
import { SettingsContext } from "../../context/settings.provider";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { TranslationSettings as TranslationSettingsType } from "../../../electron-src/@core/domain/settings_preset/settings_preset_translation";


export default function TranslationSettings() {

    const { activeSettingsPreset, updateActivePresetTranslation } = useContext( SettingsContext );

    const translation: TranslationSettingsType | undefined = activeSettingsPreset?.translation;

    const switchFormControlLabelSx: SxProps<Theme> = {
        mt: 0.1,
        mb: 0.1,
    };

    return (
        <Box sx={{ flexGrow: 1, margin: 1, mt: 0 }}>

            <Typography gutterBottom variant="h6" component="div" ml={0} mb={3}>
                Translation
            </Typography>

            <Container sx={{ mt: 2, mb: 2 }}>

                <FormGroup>

                    <FormControlLabel label='Enable translation'
                        sx={ switchFormControlLabelSx }
                        control={
                            <Switch
                                checked={ Boolean( translation?.enabled ) }
                                onChange={ ( event ) => {
                                    updateActivePresetTranslation({
                                        enabled: event.target.checked
                                    });
                                }}
                            />
                        }
                    />

                    <TextField type="password"
                        label="Gemini API Key"
                        size="small"
                        value={ translation?.api_key || '' }
                        onChange={ ( event: ChangeEvent< HTMLInputElement > ) => {
                            updateActivePresetTranslation({
                                api_key: event.target.value
                            });
                        }}
                        sx={{
                            width: '100%',
                            maxWidth: '450px',
                            mt: 2,
                            mb: 2,
                        }}
                    />

                    <FormControlLabel label='Target language' labelPlacement="top"
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            ml: 0,
                            mb: 2
                        }}
                        control={
                            <Select size="small"
                                value={ translation?.target_language || 'en' }
                                onChange={ ( event ) => {
                                    updateActivePresetTranslation({
                                        target_language: event.target.value as string
                                    });
                                }}
                                sx={{ width: '200px' }}
                            >
                                <MenuItem value='en'>English</MenuItem>
                                <MenuItem value='pt'>Portuguese</MenuItem>
                                <MenuItem value='es'>Spanish</MenuItem>
                                <MenuItem value='ko'>Korean</MenuItem>
                                <MenuItem value='zh'>Chinese</MenuItem>
                                <MenuItem value='fr'>French</MenuItem>
                                <MenuItem value='de'>German</MenuItem>
                            </Select>
                        }
                    />

                    <TextField type="text"
                        label="Model"
                        size="small"
                        value={ translation?.model || 'gemini-2.0-flash' }
                        onChange={ ( event: ChangeEvent< HTMLInputElement > ) => {
                            updateActivePresetTranslation({
                                model: event.target.value
                            });
                        }}
                        sx={{
                            width: '100%',
                            maxWidth: '450px',
                            mt: 0,
                            mb: 2,
                        }}
                    />

                </FormGroup>

            </Container>

        </Box>
    );
}
