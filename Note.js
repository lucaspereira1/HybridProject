import React from 'react';
import { Button, StyleSheet, Text, View, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "./styles";

export default class NoteBody extends React.Component {
  
	constructor(props){
		super(props);
		this.state = {};
	}   

	render() {    
    return (			
			
			<View style={styles.noteContainer}>
				<Text style={{padding: 10, justifyContent: 'flex-start'}}>{this.props.content}</Text>
			
				<Icon.Button name="delete" style={{width: '80%', justifyContent: 'flex-end', alignItems: 'flex-end'}} onPress={ () => this.props.triggerDelete(this.props.idx) }>
					 
				</Icon.Button> 
			</View> 


    );
  } 
} 
