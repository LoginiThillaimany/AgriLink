// Admin Panel for User Email Templates
// View and manage all user email templates

import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { userEmailService } from '../services/userEmailService';

export default function EmailTemplateAdmin() {
  const [userTemplates, setUserTemplates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserTemplates();
  }, []);

  const loadUserTemplates = () => {
    const templates = userEmailService.getAllUserTemplates();
    setUserTemplates(templates);
    setLoading(false);
  };

  const deleteTemplate = (email) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete the email template for ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            userEmailService.deleteUserTemplate(email);
            loadUserTemplates();
            Alert.alert('Success', 'Template deleted successfully');
          }
        }
      ]
    );
  };

  const sendTestEmail = async (email) => {
    try {
      const testOTP = '123456';
      await userEmailService.sendOTPToUser(email, testOTP);
      Alert.alert('Success', `Test email sent to ${email} with OTP: ${testOTP}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send test email');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  const templateCount = Object.keys(userTemplates).length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Email Template Admin</Text>
      <Text style={styles.subtitle}>Total Templates: {templateCount}</Text>
      
      {templateCount === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No email templates found</Text>
          <Text style={styles.emptySubtext}>Templates will be created when users signup</Text>
        </View>
      ) : (
        Object.entries(userTemplates).map(([email, template]) => (
          <View key={email} style={styles.templateCard}>
            <View style={styles.templateHeader}>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.templateIdText}>ID: {template.templateId}</Text>
            </View>
            
            <View style={styles.templateInfo}>
              <Text style={styles.nameText}>Name: {template.fullName}</Text>
              <Text style={styles.dateText}>Created: {new Date(template.createdAt).toLocaleDateString()}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.testButton}
                onPress={() => sendTestEmail(email)}
              >
                <Text style={styles.buttonText}>Send Test</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteTemplate(email)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadUserTemplates}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  templateIdText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  templateInfo: {
    marginBottom: 15,
  },
  nameText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#777',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 0.45,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 0.45,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
