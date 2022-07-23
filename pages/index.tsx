import type { NextPage } from "next";
import { useEffect, useState } from "react";
// import styles from "../styles/Home.module.css";
import Container from "react-bootstrap/Container";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { verifyToken } from "../utils/token";

const Home: NextPage = () => {
  let token: string = "";
  const [isAuth, setIsAuth] = useState(false);

  if (process.browser) {
    token = localStorage.getItem("authorization")!;
  }

  useEffect(() => {
    if (token!) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [token]);

  const logout = () => {};

  return (
    <BrowserRouter>
      <Container fluid className="header">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Link to="/" className="navbar-brand">
            ORACLE
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto flex-grow-1">
              <Link to="/notice" className="nav-link">
                공지사항
              </Link>
              <Link to="/class-community" className="nav-link">
                커뮤니티
              </Link>
              <Link to="/board-register" className="nav-link">
                글쓰기
              </Link>
              <Link to="/lunch-table" className="nav-link">
                급식표
              </Link>
              <Link to="/timetable" className="nav-link">
                시간표
              </Link>
              <span className="flex-grow-1"></span>
              {isAuth ? (
                <Nav.Link onClick={logout}>로그아웃</Nav.Link>
              ) : (
                <Link to="/login" className="nav-link">
                  로그인
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <Container></Container>
    </BrowserRouter>
  );
};

export default Home;
