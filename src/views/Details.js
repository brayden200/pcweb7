import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc, getDocs, collection } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import "./PostPageDetails.css";

export default function PostPageDetails() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [audio, setAudio] = useState("");
  const [postIds, setPostIds] = useState([]);
  const params = useParams();
  const id = params.id;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  async function deletePost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    const imageRef = ref(storage, `images/${post.imageName}`);
    const audioRef = ref(storage, `audios/${post.audioName}`);

    // Delete image and audio from Firebase Storage
    deleteObject(imageRef).then(() => {
      console.log("Image deleted from Firebase Storage");
    }).catch((error) => {
      console.error(error.message);
    });

    deleteObject(audioRef).then(() => {
      console.log("Audio deleted from Firebase Storage");
    }).catch((error) => {
      console.error(error.message);
    });

    // Delete the document from Firestore
    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setName(post.name);
    setImage(post.image);
    setAudio(post.audio);
  }

  async function fetchPostIds() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const ids = querySnapshot.docs.map(doc => doc.id);
    setPostIds(ids);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);
    fetchPostIds();
  }, [id, navigate, user, loading]);

  useEffect(() => {
    if (audio) {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    }
  }, [audio]);

  function handleNext() {
    const currentIndex = postIds.indexOf(id);
    const nextIndex = (currentIndex + 1) % postIds.length;
    const nextId = postIds[nextIndex];
    navigate(`/post/${nextId}`);
  }

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Music App</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick={() => signOut(auth)}>Sign Out</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6" className="mx-auto">
            <Image src={image} style={{ width: "100%", marginBottom: "1rem" }} />
            <Card className="mt-3">
              <Card.Body>
                <Card.Title className="text-center">{name}</Card.Title>
                {audio ? (
                  <audio
                    controls
                    src={audio}
                    ref={audioRef}
                    onEnded={handleNext}
                    style={{ width: "100%" }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <div>No audio file available</div>
                )}
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="danger" onClick={() => deletePost(id)}>Delete</Button>
                  <Button variant="secondary" onClick={handleNext}>Next</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
