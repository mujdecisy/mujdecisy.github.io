import { Box, Divider} from '@mui/material';

export default function Footer() {

    return (
        <>
            <Divider sx={{marginTop: 3}}/>
            <Box my={2} sx={{ display: 'flex', justifyContent: 'flex-end', fontSize: 'small', color: 'var(--c2)' }}>
                ©2023 mujdecisy.
            </Box>
        </>
    )
}
