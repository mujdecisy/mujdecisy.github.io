import { Container } from "@mui/material";
import { ReactNode } from "react";


export default function PwaLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Container maxWidth="sm">
                {children}
            </Container>
        </>
    );
}