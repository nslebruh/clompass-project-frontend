import {LinkContainer} from "react-router-bootstrap";
import {Navbar, Nav, Image} from "react-bootstrap"
const ClompassNavbar = (props) => {
    return (
        <>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand>
                <Image src="https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/icon.svg" fluid height="48" width="60"/> Clompass
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Dashboard</Nav.Link>
                    </LinkContainer>
                    <Nav.Link as="a" href="https://outlook.com/lilydaleheights.vic.edu.au" target="_blank" rel="noopener">Emails</Nav.Link>
                    <LinkContainer to="/learning-tasks">
                        <Nav.Link>Learning Tasks</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/schedule">
                        <Nav.Link>Schedule</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/subjects">
                        <Nav.Link>Subjects</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/student">
                        <Nav.Link>Profile</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </>
 )
}
export default ClompassNavbar