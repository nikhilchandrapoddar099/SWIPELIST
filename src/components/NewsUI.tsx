import React, { FC } from 'react';
import { View, ActivityIndicator, Text, Image, StyleSheet } from 'react-native';
import moment from 'moment';

// Define props interface for NewsUI component
interface NewsUIProps {
    isStarted: boolean; // Indicates if the app has started
    isLoading: boolean; // Indicates if data is being loaded
    isError: boolean; // Indicates if an error occurred while fetching data
    newsData: { // Data object containing news details
        title: string; // Title of the news
        urlToImage: string; // URL of the news image
        publishedAt: string; // Date and time when the news was published
        content: string; // Content of the news
        author: string; // Author of the news
    };
}

// Define the NewsUI functional component
const NewsUI: FC<NewsUIProps> = ({ isStarted, isLoading, isError, newsData }) => {

    // Render different UI components based on the state
    if (!isStarted) {
        // Render welcome message if the app has not started yet
        return (
            <View style={{ position: "absolute", bottom: 20, alignSelf: "center" }}>
                <Text style={[styles.textHeader, { color: '#06d6a0' }]}>Welcome to the News App</Text>
            </View>
        );
    } else {
        // Render loading indicator while data is being fetched
        if (isLoading) return <ActivityIndicator size="large" color='#06d6a0' />;
        
        // Render error message if an error occurred while fetching data
        if (isError) return <Text style={[styles.textHeaderNews, { fontSize: 25, color: 'red' }]}>Something went Wrong</Text>;

        // Render news details if data has been successfully fetched
        return (
            <View style={styles.boxstyle}>
                <Text style={[styles.textHeaderNews, { fontSize: 25, color: '#06d6a0' }]}>{newsData?.title}</Text>
                <Image source={{ uri: newsData?.urlToImage }} style={{ width: 350, height: 240, alignSelf: "center" }} />
                <Text style={[styles.textHeaderNews, { fontWeight: "300", alignSelf: "flex-end", fontSize: 10 }]}>PublishedAt  :-    {moment(newsData?.publishedAt).format('DD/MM/YYYY')}</Text>
                <Text style={[styles.textHeaderNews, { fontWeight: "700" }]}>{newsData?.content}</Text>
                <Text style={[styles.textHeaderNews, { fontWeight: "400", alignSelf: "flex-end", fontSize: 15, color: '#06d6a0' }]}>-: {newsData?.author}</Text>
            </View>
        );
    }
}

// Define styles for the component
const styles = StyleSheet.create({
    textHeader: {
        fontWeight: "bold",
        fontSize: 40,
        alignSelf: "center",
    },
    textHeaderNews: {
        fontWeight: "bold",
        fontSize: 15,
        marginVertical: 10
    },
    boxstyle: {
        height: '85%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 19,
        alignSelf: 'stretch',
        padding: 5,
    },
});

export default NewsUI;
