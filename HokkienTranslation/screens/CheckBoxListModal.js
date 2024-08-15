import React, {useCallback} from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modal, Checkbox } from 'native-base';
import { StyleSheet } from 'react-native';

const CheckBoxListModal = React.memo(({ modalVisible, setModalVisible, checkedItems, setCheckedItems, decks }) => {
  const handleCheckBoxChange = useCallback((values) => {
    setCheckedItems(values || []);
  }, [setCheckedItems]);
    return (
      <Modal
        animationType="slide"
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Categories</Text>
            <ScrollView style={styles.scrollView}>
            <Checkbox.Group onChange={values => {
      handleCheckBoxChange(values)
      ;}}
       value={checkedItems}>
              {decks.map((category, index) => (
                  <View key={index} style={styles.checkboxContainer}>
                  <Checkbox value={category.name}
                  
                    
                  />
                
                  <Text style={styles.label}>{category.name}</Text>
                </View>
              ))}
              </Checkbox.Group>

            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  });


const styles = StyleSheet.create({
  popupcontainer: {
    flex: 1,
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  actionButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  addBox: {
    minWidth: "48%",
    width: "48%",
    borderStyle: 'dashed',

    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },

  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
  categoryBox: {
    minWidth: "48%",
    width: "48%",

    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  categoryBoxPressed: {
    transform: [{ translateY: -5 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryText: {
    color: 'black',
    marginTop: 8,
  },
  headingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  openModalButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  openModalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
  export default CheckBoxListModal;