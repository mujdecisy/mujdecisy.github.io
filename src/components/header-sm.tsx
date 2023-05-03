import { Box, Divider, IconButton, Link, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useEffect, useState } from 'react';
import { differenceInMilliseconds } from 'date-fns';



export default function HeaderSm() {
    const links = [
        { icon: TwitterIcon, link: 'https://twitter.com/mujdecisy' },
        { icon: GitHubIcon, link: 'https://github.com/mujdecisy' },
        { icon: LinkedInIcon, link: 'https://linkedin.com/in/mujdecisy' }
    ]

    return (
        <>
            <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>

                <Box sx={{ alignItems: 'flex-end', paddingBottom: "5px" }}>
                    <Link href="/" sx={{ textDecoration: "none", fontSize: "larger", fontWeight: "200", color: "black", display: "flex" }}>
                        <Typography fontSize="1rem" fontWeight="light">
                            safa yasin
                        </Typography>
                        <Typography fontSize="1rem" fontWeight="bold" sx={{marginLeft: "4px"}}>
                            mujdeci
                        </Typography>
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {
                        links.map(e => (
                            <IconButton
                                key={e.link}
                                aria-label={e.link}
                                href={e.link}
                                target="_blank">
                                <e.icon fontSize="small" />
                            </IconButton>
                        ))
                    }
                </Box>
            </Box>

            <Divider />
        </>
    )
}