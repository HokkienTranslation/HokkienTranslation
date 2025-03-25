import React from "react";
import { Modal, Button, Text, HStack } from "native-base";

export default function DeleteFlashcardModal({
  isOpen,
  onClose,
  onDelete,
  word,
  translation,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Content maxWidth="400px" minWidth="300px">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontSize="xl" fontWeight="bold">
            Delete Confirmation
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>
            Are you sure you want to delete <Text bold>{translation}/{word}</Text>?
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <HStack space={3}>
            <Button variant="ghost" onPress={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onPress={onDelete}>
              Delete
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
