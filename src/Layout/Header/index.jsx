import { useMemo, useRef, useState } from "react";
import {
    Col,
    Container,
    Row,
} from "reactstrap";
import HeaderMenu from "../../Layout/Header/HeaderMenu.jsx";
import ActionDropdown from "../../Components/ActionDropdown/index.jsx";

const Header = () => {
    const headerMenuRef = useRef(null);
    const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

    const headerQuickActions = useMemo(
      () => [
        { key: "task-manager", label: "Task Manager", icon: "ti-list-details", onClick: () => {} },
        { key: "todo-list", label: "Todo list", icon: "ti-checklist", onClick: () => {} },
        { key: "file-manager", label: "File manager", icon: "ti-folder", onClick: () => {} },
      ],
      [],
    );

    return (
        <header className="header-main">
            <Container fluid>
                <Row className="d-flex justify-content-between w-100">
                    <Col xs="6" sm="4" className="d-flex align-items-center header-left p-0">
                        <div ref={headerMenuRef} className="position-relative">
                            <button
                                type="button"
                                className="header-toggle me-3 btn border-0"
                                onClick={() => setHeaderMenuOpen((v) => !v)}
                                aria-label="Quick menu"
                            >
                              <i className="ph ph-circles-four"></i>
                            </button>

                            <ActionDropdown
                                open={headerMenuOpen}
                                onToggle={setHeaderMenuOpen}
                                rootRef={headerMenuRef}
                                align="start"
                                actions={headerQuickActions}
                            />
                        </div>
                    </Col>

                    <Col xs="6" sm="8" className="d-flex align-items-center justify-content-end header-right p-0">
                        <HeaderMenu/>
                    </Col>
                </Row>
            </Container>
        </header>
    )
}

export default Header;
