import React, { useEffect, useState } from "react";
import { Button, Container, Image, Form, Nav, Navbar } from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostPageAdd() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [previewImage, setPreviewImage] = useState("https://zca.sg/img/placeholder");
  const [previewAudio, setPreviewAudio] = useState(null);
  const [imageName, setImageName] = useState("");
  const [audioName, setAudioName] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  async function addPost() {
    setUploading(true);
    try {
      const imageReference = ref(storage, `images/${image.name}`);
      const audioReference = ref(storage, `audios/${audio.name}`);
      
      const [imageResponse, audioResponse] = await Promise.all([
        uploadBytes(imageReference, image),
        uploadBytes(audioReference, audio)
      ]);

      const [imageURL, audioURL] = await Promise.all([
        getDownloadURL(imageResponse.ref),
        getDownloadURL(audioResponse.ref)
      ]);

      await addDoc(collection(db, "posts"), {
        name,
        image: imageURL,
        imageName,
        audio: audioURL,
        audioName
      });

      setName("");
      setImage(null);
      setAudio(null);
      setPreviewImage("https://zca.sg/img/placeholder");
      setPreviewAudio(null);
      setImageName("");
      setAudioName("");
      navigate('/');
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Failed to add post. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/login');
  }, [navigate, user, loading]);

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
        <h1 style={{ marginBlock: "1rem" }}>Add Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Song Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Image
            src={previewImage}
            style={{
              objectFit: "cover",
              width: "10rem",
              height: "10rem",
            }}
          />
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                const imageFile = e.target.files[0];
                const previewImage = URL.createObjectURL(imageFile);
                setImage(imageFile);
                setPreviewImage(previewImage);
                setImageName(imageFile.name);
              }}
            />
            <Form.Text className="text-muted">
              Make sure the file type is jpg, jpeg, or png.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="audio">
            <Form.Label>Audio</Form.Label>
            <Form.Control
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const audioFile = e.target.files[0];
                const previewAudio = URL.createObjectURL(audioFile);
                setAudio(audioFile);
                setPreviewAudio(previewAudio);
                setAudioName(audioFile.name);
              }}
            />
            <Form.Text className="text-muted">
              Make sure the file type is mp3, wav, etc.
            </Form.Text>
          </Form.Group>
          {previewAudio && (
            <audio controls src={previewAudio} />
          )}
          <Button variant="primary" onClick={addPost} disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </Form>
      </Container>
    </>
  );
}
