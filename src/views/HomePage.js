import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./PostPageHome.css";

export default function PostPageHome() {
  const [posts, setPosts] = useState([]);

  async function getAllPosts() {
    const query = await getDocs(collection(db, 'posts'));
    const posts = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  useEffect(() => {
    getAllPosts();
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
      <Container className="post-page-home">
        <Row>
          {posts.map((post, index) => (
            <Col key={index} md={4} className="mb-4">
              <PostImage post={post} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

function PostImage({ post }) {
  const { name, image, id } = post;

  return (
    <Link to={`post/${id}`} className="post-link">
      <div className="post-image-container">
        <Image src={image} alt={name} className="post-image" />
        <div className="caption-overlay">{name}</div>
      </div>
    </Link>
  );
}
