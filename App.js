import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';

export default function App() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newLogin, setNewLogin] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async () => {
    if (login === '' || password === '') {
      Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('login', '==', login));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Błąd', 'Niepoprawne dane logowania');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      if (userData.password === hashedPassword) {
        Alert.alert('Zalogowano', `Witaj ${userData.firstname} ${userData.lastName}!`);
        setUser(userData);
      } else {
        Alert.alert('Błąd', 'Niepoprawne dane logowania');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił błąd, spróbuj ponownie później');
    }
  }

  const handleLogout = () => {
    setUser('');
    setLogin('');
    setPassword('');
    Alert.alert('Wylogowano', 'Zostałeś poprawnie wylogowany');
  }

  const handleAddUser = async (email, firstname, lastName, login, plainPassword) => {
    try {
      const password = await hashPassword(plainPassword);
      await addDoc(collection(db, 'users'), {
        email,
        firstname,
        lastName,
        login,
        password
      });
      Alert.alert('Dodano użytkownika', 'Użytkownik został dodany do bazy danych');
      setNewFirstName('');
      setNewLastName('');
      setNewLogin('');
      setNewEmail('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił błąd, spróbuj ponownie później');
    }
  };

  const hashPassword = async (password) => {
    try {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      return hashedPassword;
    } catch (error) {
      console.error('Błąd haszowania hasła:', error);
      throw error;
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {!user ? (
        <View style={styles.container}>
          <Text style={styles.title}>Logowanie</Text>
          <TextInput style={styles.input} placeholder="Podaj login" onChangeText={setLogin}></TextInput>
          <TextInput style={styles.input} placeholder="Podaj hasło" onChangeText={setPassword} secureTextEntry></TextInput>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text>Zaloguj się</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Witaj, {user.firstName} {user.lastName}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text>Wyloguj się</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.title}>Dodaj nowego użytkownika</Text>
            <TextInput style={styles.input} placeholder="Podaj imię nowego użytkownika" onChangeText={setNewFirstName} value={newFirstName} />
            <TextInput style={styles.input} placeholder="Podaj nazwisko nowego użytkownika" onChangeText={setNewLastName} value={newLastName}/>
            <TextInput style={styles.input} placeholder="Podaj email nowego użytkownika" onChangeText={setNewEmail} value={newEmail}/>
            <TextInput style={styles.input} placeholder="Podaj login nowego użytkownika" onChangeText={setNewLogin} value={newLogin}/>
            <TextInput style={styles.input} placeholder="Podaj hasło nowego użytkownika" onChangeText={setNewPassword} value={newPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={() => handleAddUser(newEmail, newFirstName, newLastName, newLogin, newPassword)}>
              <Text>Dodaj użytkownika</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7FA',
    alignItems: 'center',
  },
  registerContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0078D7',
    borderWidth: 2,
    borderRadius: 10,
    width: 300,
    height: 45,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0078D7',
    padding: 15,
    borderRadius: 25,
    width: 300,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: '#FF4B4B',
    padding: 15,
    borderRadius: 25,
    width: 300,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});