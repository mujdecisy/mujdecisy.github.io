import { Box, Divider, IconButton, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Header() {
    const links = [
        { icon: TwitterIcon, link: 'https://twitter.com/mujdecisy' },
        { icon: GitHubIcon, link: 'https://github.com/mujdecisy' },
        { icon: LinkedInIcon, link: 'https://linkedin.com/in/mujdecisy' }
    ]

    return (
        <>
            <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <Typography fontSize="2rem" fontWeight="light" sx={{ textDecoration: 'underline' }}>
                        safa yasin
                    </Typography>
                    <Typography fontSize="2.4rem" fontWeight="bold" mt={-2}>
                        mujdeci
                    </Typography>
                </Box>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'flex-end' }}>
                    <Typography fontSize="2.2rem" fontWeight="light">
                        safa yasin&nbsp;
                    </Typography>
                    <Typography fontWeight="bold" fontSize="2.2rem">
                        mujdeci
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {
                        links.map(e => (
                            <IconButton
                                key={e.link}
                                aria-label={e.link}
                                href={e.link}
                                target="_blank">
                                <e.icon fontSize="large" />
                            </IconButton>
                        ))
                    }
                </Box>
            </Box>

            <Divider/>
        </>
    )
}