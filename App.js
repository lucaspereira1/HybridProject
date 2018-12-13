import React from 'react';
import { Alert, FlatList, TouchableHighlight, StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "./styles";
import Note from './Note';
import { AsyncStorage } from "react-native";

// Definição da tela de Login 
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: ''
    }
  }
  //Definção do Botao de Login
  _onPressButton=() =>{
    const {user, password} = this.state;
    if((user!="Lucas" || user=="")){
      Alert.alert("Enter a valid username");
    }
    else if ((password!="Admin" || password=="")) {
      Alert.alert("Enter a correct password");
    } else {
      Alert.alert("All right!");
      this.props.navigation.navigate('Notes');
    }
  }

  //Configuracoes do Header
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#FFBB00',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  // Definicao dos componentes
  render() {
    let pic = {
      uri: 'https://www.google.com/images/icons/product/keep-512.png'
    };
    return (
      <View style={styles.container}>
          <View>
            <Image source={pic} style={{width:200, height:200}}/>
          </View>
          <View style={styles.login}>
            <Text style={{fontWeight: 'bold'}}>Username: </Text>
            <TextInput
              placeholder="Enter your Username"
              onChangeText={
                user => this.setState({user})
              }
            />
            </View>
            <View style={styles.login}>
              <Text style={{fontWeight: 'bold'}}>Password: </Text>
              <TextInput
                placeholder="Enter your Password"
                onChangeText={
                password => this.setState({password})
                }
              />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={this._onPressButton}
              title="Login"
            />
        </View>

      </View>
    );
  }
}

// Definição da Tela de Notas 
class NotesScreen extends React.Component {
  /**
  * Set up this.state and bind `this` to functions.
  * @param props
  */
  constructor(props) {
    super(props);

    this.state = {
      
        //Note Text//
        noteValue: '',
        
        //Note Array//
        noteSize: 0,
        
        
        items: [],
        refresh: false, 
    };
    this.add = this.add.bind(this);
    this.updateList = this.updateList.bind(this);
    this.loadList();
    this.delete = this.delete.bind(this);
  }

  //Função Update
  async updateList(){

    this.setState({ refresh: !this.state.refresh });
  }

  // Função Add Notas
  async add(){    
        
    try {    
    
      var str = 'admin';
      
      {/* Push note current value and the new array size */}
      this.state.items.push({noteContent: this.state.noteValue, key: this.state.items.length.toString()});                
      var contents = JSON.stringify(this.state.items);
      var current_time = new Date().toDateString();
      var cont = contents + ' Data de Criação: ' + current_time; 
        
      {/* Save changes to DB */}      
      await AsyncStorage.setItem(str, contents);          
      
      //Atualiza
      this.updateList();
      
    } catch (error) {
      alert("Um erro ocorreu no adicionar da lista!"+error);
      
    }
      
  }

  // Função Carrega Notas
  async loadList(){              
    
    try{
      
      var str = 'admin';
      
      {/* Try to get old Notes looking at the storage, if doesnt have */}
      var oldnotes = await AsyncStorage.getItem(str); 
      
      if(oldnotes != null){
        this.state.items = JSON.parse(oldnotes);          
      }
      else{
        this.state.items = [];
      }
    }
    catch (error) {   
      alert("Um erro ocorreu no carregar da lista!"+error);
    }  
    
    //Atualiza
    this.updateList();
  }

  //Delete Item//
  async delete(id){
    
    this.state.items.splice(id, 1);
    
    var str = 'admin';
    
    {/* Get note contents */}
    var contents = JSON.stringify(this.state.items);  
    
    {/* Save note content to DB */}   
    await AsyncStorage.setItem(str, contents);          
    
    //Atualiza
    this.updateList();  
  }


  //Configuracoes do Header
  static navigationOptions = {
    title: 'Notes',
    headerStyle: {
      backgroundColor: '#FFBB00',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: (
      <TouchableHighlight
        onPress={() => alert('This actually does nothing. Enter your note below')}
        underlayColor="#FFB300">
        <Icon name="add" style={{ fontSize: 25, color: "#fff", margin:15 }}/>
      </TouchableHighlight>
    ),
  };

  //Configuracoes dos componentes
  render() {

    return (
      <View style={styles.notesContainer}>
        
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />

        {/* Title */}
        <Text>Add content here!</Text>
        
        {/* Input of the note */}
        <TextInput name="noteValue" onChangeText={(noteValue) => this.setState({noteValue})} style={{width: '100%', backgroundColor: '#eee'}}/>
        
        {/* Add Icon Button */}
        <Icon.Button name="add"  style={{margin: 10, width: '80%'}} onPress={this.add}>
          New Note
        </Icon.Button>

        {/* Flat List */}
        <FlatList    
          style={{ height: '20%', width: '95%', backgroundColor: '#fff',}}
          extraData={this.state.refresh}
          data={this.state.items} 
          renderItem={({item, index}) => <Note content={ item.noteContent } triggerDelete={ this.delete } idx={ index } />} 
        /> 

      </View>
    );
  }

    /**
     * Display that no notes were found.
     * @returns {View} with Icon and Text
     */
    static displayNoNotes() {
        return (
            <View style={styles.noNotes}>
                <Icon name="note-add" style={{fontSize: 100, color: "#212121"}}/>
            </View>
        );
    }

}

// Definição do Stack de Navegação 
const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Notes: {
      screen: NotesScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}