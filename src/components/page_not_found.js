import React from 'react';
import { LinkContainer } from "react-router-bootstrap"
import { Container, Button } from 'react-bootstrap';

const PageNotFound = () => {
    return (
        <Container>
            <h1>Error: 404</h1>
            <h1>Page not found</h1>
            <LinkContainer to={"/"}>
                <Button>
                    Return to dashboard
                </Button>
            </LinkContainer>
        </Container>
    )
}
export default PageNotFound;