import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Container,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Checkbox,
  Divider,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AddEvent } from "../components/AddEvent";
import { EventSearch } from "../components/EventSearch";
import backgroundImage from "../components/backgroundImage.jpg";
import { handleLogin, isAuthenticated } from "../FrontLogin/AuthUtils";
import { Logo } from "../FrontLogin/Logo";
import { OAuthButtonGroup } from "../FrontLogin/OAuthButtonGroup";
import { PasswordField } from "../FrontLogin/PasswordField";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchCategories(); // Fetch categories on component mount
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/events");
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      console.log("Fetched categories data:", data); // Log the fetched data
      setCategories(data.categories || data); // Ensure the correct structure
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setError(""); // Clear any previous error when closing the modal
    onClose(); // Close the modal after successful login
    if (isAuthenticated()) {
      navigate("/");
    }
  };

  const userIsAuthenticated = isAuthenticated(); // This line reads the isAuthenticated value

  return (
    <Container maxW="container.lg" position="relative">
      <Flex
        direction="column"
        align="flex-end"
        position="absolute"
        top="0"
        right="0"
        zIndex="1"
        p="4"
      >
        {userIsAuthenticated && <Logo />}
        <Button
          onClick={onOpen}
          bgSize="cover"
          bgImage={`url(${backgroundImage})`}
          bgPosition="center"
          borderRadius="15px"
          border="3px solid"
          padding="0.6em 1.2em"
          fontSize="1.0em"
          color={"black"}
          mt={5}
          w="150px"
          h="100px"
          fontWeight="650"
          fontFamily="inherit"
          cursor="pointer"
          transition="border-color 0.25s, box-shadow 0.50s"
          _hover={{
            borderColor: "purple",
            boxShadow: "0 0 8px 2px rgba(128, 78, 254, 0.8)",
          }}
          _focus={{ outline: "4px auto -webkit-focus-ring-color" }}
        >
          Click to Add Event
        </Button>
      </Flex>
      <Heading as="h1" textAlign="center" mt="10">
        Winc's Events
      </Heading>
      <EventSearch events={events} setFilteredEvents={setFilteredEvents} />

      {!userIsAuthenticated && (
        <Stack spacing="2">
          <Text color="gray.500" textAlign="center">
            Don't have an account? <Link as={RouterLink} to="#">Sign up</Link>
          </Text>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={{ base: "transparent", sm: "white" }}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={{ base: "none", sm: "ml" }}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <PasswordField
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                <Button variant="link" size="sm">
                  Forgot password?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button onClick={() => handleLogin(username, password, closeModal)}>
                  Sign in
                </Button>
                <HStack>
                  <Divider />
                  <Text textStyle="sm" whiteSpace="nowrap" color="gray.500">
                    or continue with
                  </Text>
                  <Divider />
                </HStack>
                <OAuthButtonGroup />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Pass categories as prop */}
            <AddEvent
              setFilteredEvents={setFilteredEvents}
              events={events}
              categories={categories}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close Modal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box>
        {/* Placeholder Box, add your additional content here if needed */}
      </Box>

      <Stack
        spacing={4}
        h="20vh"
        flexDir="row"
        flexWrap="wrap"
        justifyContent="space-around"
        ml="auto"
      >
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            borderWidth="7px"
            boxShadow="dark-lg"
            w="250px"
            h="250px"
            bg="white"
            align="center"
            bgImage={`url(${event.image})`}
            bgSize="cover"
            bgPosition="center"
            borderRadius="15px"
            border="3px solid"
            padding="0.6em 1.2em"
            fontSize="1em"
            fontWeight="extrabold"
            fontFamily="inherit"
            fontStyle="bold"
            color={"black"}
            cursor="pointer"
            transition="border-color 0.25s, box-shadow 0.25s"
            _hover={{
              borderColor: "purple",
              boxShadow: "0 0 8px 2px rgba(128, 78, 254, 0.5)",
            }}
            _focus={{ outline: "4px auto -webkit-focus-ring-color" }}
            onClick={() => navigate(`/event/${event.id}`)}
          >
            <Link to={`/event/${event.id}`}>
              <Box _hover={{ color: "purple" }}>
                <Heading as="h2" mb={5} size="md" fontWeight={"extrabold"}>
                  {event.title}
                </Heading>
                <Text>{event.description}</Text>
                <Text>{event.startTime}</Text>
                <Text>{event.endTime}</Text>
                <Text>Category: {event.category}</Text>
                <Text>Created by: {event.createdBy}</Text>
              </Box>
            </Link>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};