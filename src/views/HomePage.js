import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./HomePage.css";

export default function HomePage() {
  const [songs, setSongs] = useState([]);

  async function getAllSongs() {
    const query = await getDocs(collection(db, 'posts'));
    const songs = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setSongs(songs);
  }

  useEffect(() => {
    getAllSongs();
  }, []);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Music App</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Song</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="song-page-home">
        <Row>
          {songs.map((song, index) => (
            <Col key={index} md={4} className="mb-4">
              <SongImage song={song} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

function SongImage({ song }) {
  const { name, image, id } = song;

  return (
    <Link to={`song/${id}`} className="song-link">
      <div className="song-image-container">
        <Image src={image} alt={name} className="song-image" />
        <div className="caption-overlay">{name}</div>
      </div>
    </Link>
  );
}
