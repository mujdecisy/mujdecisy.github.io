import { Box, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";

export interface PostPreviewI {
    color: string
    link: string
    title: string
    date: string
    summary: string
}

export default function PostPreview({ item }: { item: PostPreviewI }) {

    return (
        <ListItem alignItems="flex-start">
            <ListItemText
                primary={
                    <Box sx={{display: "flex", alignItems: "end", justifyContent: "space-between" }} >
                        <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            <Link href={item.link}>
                                {item.title}
                            </Link>
                        </Box>
                        <Box sx={{display: "flex", justifyContent:"end", fontSize: "0.8rem", fontWeight: "200", textAlign: "end", width: "70px"}}>
                            {item.date}
                            <Box sx={{backgroundColor: item.color, width: '3px', height: '20px', marginLeft: '5px'}}></Box>
                        </Box>
                    </Box>
                }
                secondary={item.summary}
            />
        </ListItem>
    );
}