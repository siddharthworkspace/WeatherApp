import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface StatusModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
}

export const StatusModal: React.FC<StatusModalProps> = ({ 
  visible, title, message, onClose, onConfirm, confirmText = "Open Settings" 
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.card}>
        <AlertCircle size={48} color="#FDA4AF" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmBtnText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#1E293B', padding: 24, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  title: { color: '#FFF', fontSize: 20, fontWeight: '700', marginTop: 15 },
  message: { color: '#CBD5E1', textAlign: 'center', marginVertical: 15, fontSize: 14 },
  buttonRow: { flexDirection: 'row', marginTop: 10, gap: 10 },
  cancelBtn: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', flex: 1 },
  confirmBtn: { padding: 12, borderRadius: 12, backgroundColor: '#38BDF8', flex: 1 },
  btnText: { color: '#FFF', textAlign: 'center', fontWeight: '600' },
  confirmBtnText: { color: '#0F172A', textAlign: 'center', fontWeight: '700' }
});