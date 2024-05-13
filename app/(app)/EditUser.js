import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { supabase } from '../../util/supabase';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

export default function EditUser() {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateOption, setUpdateOption] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const { data, error } = await supabase.from('Worker').select('*');
      if (error) {
        console.error('Error fetching workers:', error.message);
      } else {
        setWorkers(data);
      }
    } catch (error) {
      console.error('Error fetching workers:', error.message);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this worker?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const { error } = await supabase.from('Worker').delete().eq('id', id);
              if (error) {
                console.error('Error deleting worker:', error.message);
              } else {
                Alert.alert('Success', 'Worker deleted successfully!');
                fetchWorkers();
              }
            } catch (error) {
              console.error('Error deleting worker:', error.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleUpdate = async () => {
    if (!selectedWorker || !updateOption || !newValue) {
      Alert.alert('Error', 'Please select a worker and update option, and provide a new value.');
      return;
    }

    Alert.alert(
      'Confirmation',
      `Are you sure you want to update ${updateOption.toLowerCase()} for this worker?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            try {
              let updates = {};
              if (updateOption === 'Name') {
                updates = { Name: newValue };
              } else if (updateOption === 'Username') {
                updates = { Username: newValue };
              } else if (updateOption === 'Password') {
                updates = { Password: newValue };
              }

              const { error } = await supabase.from('Worker').update(updates).eq('id', selectedWorker.id);
              if (error) {
                console.error('Error updating worker:', error.message);
              } else {
                Alert.alert('Success', 'Worker updated successfully!');
                setModalVisible(false);
                fetchWorkers();
              }
            } catch (error) {
              console.error('Error updating worker:', error.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDisable = async (id) => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to ${workers.find(worker => worker.id === id).Activity ? 'disable' : 'enable'} this worker?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const { data: worker, error } = await supabase
                .from('Worker')
                .select('Activity')
                .eq('id', id)
                .single();

              if (error) {
                console.error('Error fetching worker:', error.message);
                return;
              }

              const updatedActivity = !worker.Activity; 

              const { error: updateError } = await supabase
                .from('Worker')
                .update({ Activity: updatedActivity })
                .eq('id', id);

              if (updateError) {
                console.error('Error updating worker activity:', updateError.message);
              } else {
                Alert.alert(
                  'Success',
                  `Worker activity has been ${updatedActivity ? 'enabled' : 'disabled'} successfully!`
                );
                fetchWorkers();
              }
            } catch (error) {
              console.error('Error toggling worker activity:', error.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const openModal = (worker) => {
    setSelectedWorker(worker);
    setUpdateOption('');
    setNewValue('');
    setModalVisible(true);
  };

  const renderTextInput = () => {
    if (updateOption === 'Password' || updateOption === 'Username' || updateOption === 'Name') {
      return (
        <TextInput
          style={styles.input}
          placeholder={`Enter new ${updateOption.toLowerCase()}`}
          onChangeText={setNewValue}
          value={newValue}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Worker List</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>SNO</Text>
          <Text style={[styles.cell, styles.headerCell]}>Name</Text>
          <Text style={[styles.cell, styles.headerCell, styles.adjust]}>Actions</Text>
        </View>
        {workers.map((worker, index) => (
          <View key={worker.id} style={[styles.row, worker.Activity ? styles.activeRow : styles.inactiveRow]}>
            <Text style={[styles.cell, styles.adjust1]}>{index + 1}</Text>
            <Text style={styles.cell}>{worker.Name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => openModal(worker)}>
                <Entypo name="edit" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(worker.id)}>
                <MaterialIcons name="delete" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.disableButton]}
                onPress={() => handleDisable(worker.id)}>
                <MaterialIcons name={worker.Activity ? "disabled-by-default" : "check"} size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Worker</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setUpdateOption('Name')}>
              <Text style={styles.modalOptionText}>Update Name</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setUpdateOption('Username')}>
              <Text style={styles.modalOptionText}>Update Username</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setUpdateOption('Password')}>
              <Text style={styles.modalOptionText}>Update Password</Text>
            </TouchableOpacity>
            {renderTextInput()}
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    width: '98%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cell: {
    flex: 1,
  },
  headerCell: {
    fontWeight: 'bold',
    padding:10
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:10
  },
  actionButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#f0ad4e',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  disableButton: {
    backgroundColor: '#5bc0de',
  },
  adjust:{
    marginLeft:15
  },
  adjust1:{
    marginLeft:10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width:"100%"
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor:"blue",
    marginBottom:15,
    borderRadius:10
  },
  modalOptionText: {
    fontSize: 16,
    color:"white",
    textAlign:"center"

  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#5cb85c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeRow: {
    backgroundColor: '#c8e6c9', 
  },
  inactiveRow: {
    backgroundColor: '#ffcdd2', 
  },
});
