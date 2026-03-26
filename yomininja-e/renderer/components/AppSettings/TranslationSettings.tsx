import { Box, Container, FormControlLabel, FormGroup, MenuItem, Select, Switch, SxProps, TextField, Theme, Typography } from "@mui/material";
import { SettingsContext } from "../../context/settings.provider";
import { ChangeEvent, useContext } from "react";
import { TranslationSettings as TranslationSettingsType, TranslationSource } from "../../../electron-src/@core/domain/settings_preset/settings_preset_translation";


export default function TranslationSettings() {

    const { activeSettingsPreset, updateActivePresetTranslation } = useContext( SettingsContext );

    const translation: TranslationSettingsType | undefined = activeSettingsPreset?.translation;
    const source: TranslationSource = translation?.source || 'gemini';

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

                    <FormControlLabel label='Hide non-Japanese text from overlay'
                        sx={ switchFormControlLabelSx }
                        control={
                            <Switch
                                checked={ Boolean( translation?.hide_non_japanese ) }
                                onChange={ ( event ) => {
                                    updateActivePresetTranslation({
                                        hide_non_japanese: event.target.checked
                                    });
                                }}
                            />
                        }
                    />

                    <FormControlLabel label='Source' labelPlacement="top"
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            ml: 0,
                            mt: 2,
                            mb: 2
                        }}
                        control={
                            <Select size="small"
                                value={ source }
                                onChange={ ( event ) => {
                                    updateActivePresetTranslation({
                                        source: event.target.value as TranslationSource
                                    });
                                }}
                                sx={{ width: '200px' }}
                            >
                                <MenuItem value='gemini'>Gemini</MenuItem>
                                <MenuItem value='koboldcpp'>KoboldCpp</MenuItem>
                            </Select>
                        }
                    />

                    { source === 'gemini' && (
                        <>
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
                                    mt: 0,
                                    mb: 2,
                                }}
                            />

                            <TextField type="text"
                                label="Model"
                                size="small"
                                value={ translation?.model || 'gemini-3.1-flash-lite-preview' }
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
                        </>
                    )}

                    { source === 'koboldcpp' && (
                        <TextField type="text"
                            label="KoboldCpp Host"
                            size="small"
                            placeholder="http://localhost:5001"
                            value={ translation?.koboldcpp_host || '' }
                            onChange={ ( event: ChangeEvent< HTMLInputElement > ) => {
                                updateActivePresetTranslation({
                                    koboldcpp_host: event.target.value
                                });
                            }}
                            sx={{
                                width: '100%',
                                maxWidth: '450px',
                                mt: 0,
                                mb: 2,
                            }}
                        />
                    )}

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
                        label="Extra context for prompt"
                        size="small"
                        placeholder="e.g. This is a visual novel about..."
                        multiline
                        minRows={2}
                        maxRows={4}
                        value={ translation?.extra_context || '' }
                        onChange={ ( event: ChangeEvent< HTMLInputElement > ) => {
                            updateActivePresetTranslation({
                                extra_context: event.target.value
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
