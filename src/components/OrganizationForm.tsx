import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS, DAY_MAP } from '../constants';
import { OrganizationRules } from '../types';

// Função para calcular a próxima reunião baseada nas regras
const calculateNextMeeting = (rules: OrganizationRules): Date | null => {
  const today = new Date();
  
  // Reuniões diárias
  if (rules.meetingFrequency === 'daily') {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
  
  // Reuniões semanais
  if (rules.meetingFrequency === 'weekly' && rules.meetingDay) {
    const targetDay = DAY_MAP[rules.meetingDay] - 1; // Converter C# (1-7) para JS (0-6)
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    
    const nextMeeting = new Date(today);
    nextMeeting.setDate(today.getDate() + daysToAdd);
    return nextMeeting;
  }
  
  // Reuniões quinzenais
  if (rules.meetingFrequency === 'biweekly' && rules.meetingDay) {
    const targetDay = DAY_MAP[rules.meetingDay] - 1; // Converter C# (1-7) para JS (0-6)
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    
    // Se nextWeekMeeting for FALSE, adiciona 7 dias extras (próxima semana NÃO terá)
    if (!rules.nextWeekMeeting) {
      daysToAdd += 7;
    }
    
    const nextMeeting = new Date(today);
    nextMeeting.setDate(today.getDate() + daysToAdd);
    return nextMeeting;
  }
  
  // Reuniões mensais
  if (rules.meetingFrequency === 'monthly' && rules.meetingWeek && rules.meetingDay) {
    const targetDay = DAY_MAP[rules.meetingDay] - 1; // Converter C# (1-7) para JS (0-6)
    const targetWeek = rules.meetingWeek;
    
    // Calcular o primeiro dia do próximo mês
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    nextMonth.setDate(1);
    
    // Encontrar o primeiro dia da semana desejada no próximo mês
    const firstDayOfWeek = nextMonth.getDay();
    const daysToFirstTargetDay = (targetDay - firstDayOfWeek + 7) % 7;
    const firstTargetDay = new Date(nextMonth);
    firstTargetDay.setDate(1 + daysToFirstTargetDay);
    
    // Calcular a semana desejada (1ª, 2ª, 3ª, 4ª ou última)
    const targetDate = new Date(firstTargetDay);
    if (targetWeek && targetWeek === 4) { // Última semana (4ª semana)
      // Ir para a última semana do mês
      const lastDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
      const lastWeekStart = new Date(lastDayOfMonth);
      lastWeekStart.setDate(lastDayOfMonth.getDate() - lastDayOfMonth.getDay() + targetDay);
      if (lastWeekStart.getMonth() === nextMonth.getMonth()) {
        targetDate.setTime(lastWeekStart.getTime());
      }
    } else {
      targetDate.setDate(firstTargetDay.getDate() + (targetWeek - 1) * 7);
    }
    
    return targetDate;
  }
  
  return null;
};

// Função para formatar a data da próxima reunião
const formatNextMeetingDate = (date: Date | null): string => {
  if (!date) return 'Não há reuniões programadas';
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  if (isToday) return 'Hoje';
  if (isTomorrow) return 'Amanhã';
  
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para calcular dias até a reunião
const getDaysUntilMeeting = (date: Date | null): number | null => {
  if (!date) return null;
  
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

interface OrganizationFormData {
  name: string;
  description: string;
  image: string | null;
  rules: OrganizationRules;
}

interface OrganizationFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  isLoading?: boolean;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    description: '',
    image: null,
         rules: {
       loanDurationDays: 30,
       meetingFrequency: 'weekly',
       meetingDay: 'monday',
       meetingTime: '19:00',
       nextWeekMeeting: false, // Novo campo para quinzenal
     },
  });

  const frequencyOptions = [
    { value: 'na', label: 'Não há reuniões' },
    { value: 'daily', label: 'Diária' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quinzenal' },
    { value: 'monthly', label: 'Mensal' },
  ];

  const dayOptions = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' },
  ];

  const shouldShowDayPicker = () => {
    return formData.rules.meetingFrequency === 'weekly' || 
           formData.rules.meetingFrequency === 'biweekly' || 
           formData.rules.meetingFrequency === 'monthly';
  };

  // Calcular próxima reunião automaticamente
  const nextMeetingInfo = useMemo(() => {
    const nextMeeting = calculateNextMeeting(formData.rules);
    const formatted = formatNextMeetingDate(nextMeeting);
    const daysUntil = getDaysUntilMeeting(nextMeeting);
    
    return {
      date: nextMeeting,
      formatted,
      daysUntil,
      hasMeeting: nextMeeting !== null
    };
  }, [formData.rules]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome da organização é obrigatório');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Descrição da organização é obrigatória');
      return;
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Erro ao criar organização:', error);
    }
  };

  const handleClose = () => {
         setFormData({
       name: '',
       description: '',
       image: null,
                rules: {
           loanDurationDays: 30,
           meetingFrequency: 'weekly',
           meetingDay: 'monday',
           meetingTime: '19:00',
           nextWeekMeeting: false,
         },
     });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Criar Nova Organização</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Organização *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Digite o nome da organização"
                  placeholderTextColor={COLORS.gray[400]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descrição *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Descreva a organização e seus objetivos"
                  placeholderTextColor={COLORS.gray[400]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL da Imagem (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.image || ''}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, image: text || null }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                  placeholderTextColor={COLORS.gray[400]}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Regras da Organização</Text>
              
              <View style={styles.rulesContainer}>
                <View style={styles.ruleItem}>
                  <Text style={styles.ruleLabel}>Duração do empréstimo (dias)</Text>
                  <TextInput
                    style={styles.ruleInput}
                    value={formData.rules.loanDurationDays.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 30;
                      setFormData(prev => ({
                        ...prev,
                        rules: { ...prev.rules, loanDurationDays: value }
                      }));
                    }}
                    keyboardType="numeric"
                    placeholder="30"
                  />
                </View>

                <View style={styles.ruleItem}>
                  <Text style={styles.ruleLabel}>Frequência de reuniões</Text>
                                    <View style={styles.pickerContainer}>
                                         <Picker
                       selectedValue={formData.rules.meetingFrequency}
                       style={styles.picker}
                       mode="dropdown"
                       onValueChange={(itemValue) => {
                        setFormData(prev => ({
                          ...prev,
                          rules: { 
                            ...prev.rules, 
                            meetingFrequency: itemValue,
                            // Reset meetingDay if frequency is 'na' or 'daily'
                            meetingDay: (itemValue === 'na' || itemValue === 'daily') 
                              ? undefined 
                              : prev.rules.meetingDay
                          }
                        }));
                      }}
                    >
                      {frequencyOptions.map((option) => (
                        <Picker.Item 
                          key={option.value} 
                          label={option.label} 
                          value={option.value} 
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {shouldShowDayPicker() && (
                  <View style={styles.ruleItem}>
                    <Text style={styles.ruleLabel}>Dia da semana</Text>
                                        <View style={styles.pickerContainer}>
                                             <Picker
                         selectedValue={formData.rules.meetingDay}
                         style={styles.picker}
                         mode="dropdown"
                         onValueChange={(itemValue) => {
                          setFormData(prev => ({
                            ...prev,
                            rules: { ...prev.rules, meetingDay: itemValue }
                          }));
                        }}
                      >
                        {dayOptions.map((option) => (
                          <Picker.Item 
                            key={option.value} 
                            label={option.label} 
                            value={option.value} 
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                )}

                <View style={styles.ruleItem}>
                  <Text style={styles.ruleLabel}>Horário da reunião</Text>
                  <TextInput
                    style={styles.ruleInput}
                    value={formData.rules.meetingTime || ''}
                    onChangeText={(text) => {
                      setFormData(prev => ({
                        ...prev,
                        rules: { ...prev.rules, meetingTime: text }
                      }));
                    }}
                    placeholder="19:00"
                  />
                </View>

                

                 {formData.rules.meetingFrequency === 'biweekly' && (
                   <View style={styles.ruleItem}>
                     <Text style={styles.ruleLabel}>Próxima semana terá encontro</Text>
                     <TouchableOpacity
                       style={[styles.toggleButton, formData.rules.nextWeekMeeting && styles.toggleButtonActive]}
                       onPress={() => {
                         setFormData(prev => ({
                           ...prev,
                           rules: { ...prev.rules, nextWeekMeeting: !prev.rules.nextWeekMeeting }
                         }));
                       }}
                     >
                       <Text style={styles.toggleText}>
                         {formData.rules.nextWeekMeeting ? 'Sim' : 'Não'}
                       </Text>
                     </TouchableOpacity>
                   </View>
                 )}
              </View>
            </View>

            {/* Seção de Previsão da Próxima Reunião */}
            {formData.rules.meetingFrequency !== 'na' && (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>📅 Previsão da Próxima Reunião</Text>
                <View style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <Text style={styles.predictionIcon}>📅</Text>
                    <Text style={styles.predictionTitle}>Próxima Reunião</Text>
                  </View>
                  
                  {nextMeetingInfo.hasMeeting ? (
                    <View style={styles.predictionContent}>
                      <Text style={styles.predictionDate}>{nextMeetingInfo.formatted}</Text>
                      {formData.rules.meetingTime && (
                        <Text style={styles.predictionTime}>às {formData.rules.meetingTime}</Text>
                      )}
                      {nextMeetingInfo.daysUntil !== null && nextMeetingInfo.daysUntil > 0 && (
                        <Text style={styles.predictionDays}>
                          {nextMeetingInfo.daysUntil === 1 ? 'Amanhã' : `Em ${nextMeetingInfo.daysUntil} dias`}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.predictionNoMeeting}>Não há reuniões programadas</Text>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.cancelButton, styles.footerButton]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.submitButton, styles.footerButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Criando...' : 'Criar Organização'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  formSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rulesContainer: {
    gap: SPACING.md,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  ruleLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    flex: 1,
  },
  ruleInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    backgroundColor: COLORS.white,
    width: 80,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
    minWidth: 120,
    paddingHorizontal: SPACING.sm,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.sm,
    borderWidth: 0,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    gap: SPACING.md,
  },
  footerButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.gray[200],
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  disabledButton: {
    opacity: 0.6,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.gray[100],
    width: 80,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  // Estilos para a seção de previsão
  predictionCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  predictionIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.sm,
  },
  predictionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
  },
  predictionContent: {
    alignItems: 'flex-start',
  },
  predictionDate: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs / 2,
  },
  predictionTime: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.xs / 2,
  },
  predictionDays: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  predictionNoMeeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.8,
    fontStyle: 'italic',
  },
}); 