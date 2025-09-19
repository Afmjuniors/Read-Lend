import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { OrganizationRules } from '../types';

interface OrganizationRulesFormProps {
  rules: OrganizationRules;
  onRulesChange: (rules: OrganizationRules) => void;
}

export const OrganizationRulesForm: React.FC<OrganizationRulesFormProps> = ({
  rules,
  onRulesChange,
}) => {
  const [localRules, setLocalRules] = useState<OrganizationRules>(rules);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [nextWeekHasMeeting, setNextWeekHasMeeting] = useState(true);

  // Sincronizar regras quando mudarem externamente
  useEffect(() => {
    setLocalRules(rules);
  }, [rules]);

  const updateRules = (newRules: Partial<OrganizationRules>) => {
    const updatedRules = { ...localRules, ...newRules };
    
         // Validação: se meetingFrequency é 'na', limpar outros campos
     if (updatedRules.meetingFrequency === 'na') {
       updatedRules.meetingDay = undefined;
       updatedRules.meetingWeek = undefined;
       updatedRules.meetingTime = undefined;
     }
    
    // Validação: se meetingFrequency é 'daily', não precisa de dia específico
    if (updatedRules.meetingFrequency === 'daily') {
      updatedRules.meetingDay = undefined;
      updatedRules.meetingWeek = undefined;
    }
    
    // Validação: se meetingFrequency é 'weekly' ou 'biweekly', garantir que meetingDay está definido
    if ((updatedRules.meetingFrequency === 'weekly' || updatedRules.meetingFrequency === 'biweekly') && !updatedRules.meetingDay) {
      updatedRules.meetingDay = 'monday'; // valor padrão
    }
    
    // Validação: se meetingFrequency é 'monthly', garantir que meetingWeek e meetingDay estão definidos
    if (updatedRules.meetingFrequency === 'monthly') {
      if (!updatedRules.meetingWeek) {
        updatedRules.meetingWeek = 1; // valor padrão
      }
      if (!updatedRules.meetingDay) {
        updatedRules.meetingDay = 'monday'; // valor padrão
      }
    }
    
    setLocalRules(updatedRules);
    onRulesChange(updatedRules);
  };

     const frequencyOptions = [
     { value: 'na', label: 'N/A - Sem reuniões regulares' },
     { value: 'daily', label: 'Diário - Dias úteis (Seg-Sex)' },
     { value: 'weekly', label: '1x por semana' },
     { value: 'biweekly', label: '1x a cada 15 dias' },
     { value: 'monthly', label: '1x por mês' },
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

  const weekOptions = [
    { value: 1, label: '1º' },
    { value: 2, label: '2º' },
    { value: 3, label: '3º' },
    { value: 4, label: '4º' },
  ];

     const getFrequencyText = () => {
     if (localRules.meetingFrequency === 'na') return 'N/A';
     if (localRules.meetingFrequency === 'daily') {
       return 'Dias úteis (Seg-Sex)';
     }
    if (localRules.meetingFrequency === 'weekly') {
      const day = dayOptions.find(d => d.value === localRules.meetingDay);
      return `Toda ${day?.label || 'semana'}`;
    }
    if (localRules.meetingFrequency === 'biweekly') {
      const day = dayOptions.find(d => d.value === localRules.meetingDay);
      return `A cada 15 dias (${day?.label || 'quinzenal'})`;
    }
    if (localRules.meetingFrequency === 'monthly') {
      const week = weekOptions.find(w => w.value === localRules.meetingWeek);
      const day = dayOptions.find(d => d.value === localRules.meetingDay);
      return `${week?.label || ''} ${day?.label || 'do mês'}`;
    }
    return 'N/A';
  };

  // Calcular a próxima reunião baseada na frequência
  const calculateNextMeeting = () => {
    const today = new Date();
    
    if (localRules.meetingFrequency === 'na') {
      return null;
    }
    
         if (localRules.meetingFrequency === 'daily') {
       // Para reuniões diárias comerciais, a próxima é o próximo dia útil
       const tomorrow = new Date(today);
       tomorrow.setDate(tomorrow.getDate() + 1);
       
       // Se amanhã é fim de semana, pular para segunda-feira
       const dayOfWeek = tomorrow.getDay();
       if (dayOfWeek === 0) { // Domingo
         tomorrow.setDate(tomorrow.getDate() + 1); // Segunda-feira
       } else if (dayOfWeek === 6) { // Sábado
         tomorrow.setDate(tomorrow.getDate() + 2); // Segunda-feira
       }
       
       return tomorrow;
     }
    
    if (localRules.meetingFrequency === 'weekly' && localRules.meetingDay) {
      // Para reuniões semanais, calcular o próximo dia da semana
      const dayMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
        'friday': 5, 'saturday': 6, 'sunday': 0
      };
      
      const targetDay = dayMap[localRules.meetingDay];
      const currentDay = today.getDay();
      let daysToAdd = targetDay - currentDay;
      
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Próxima semana
      }
      
      const nextMeeting = new Date(today);
      nextMeeting.setDate(today.getDate() + daysToAdd);
      return nextMeeting;
    }
    
    if (localRules.meetingFrequency === 'biweekly' && localRules.meetingDay) {
      // Para reuniões quinzenais, considerar o controle da próxima semana
      const dayMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
        'friday': 5, 'saturday': 6, 'sunday': 0
      };
      
      const targetDay = dayMap[localRules.meetingDay];
      const currentDay = today.getDay();
      let daysToAdd = targetDay - currentDay;
      
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Próxima semana
      }
      
      // Se a próxima semana não terá reunião, adicionar mais 7 dias
      if (!nextWeekHasMeeting) {
        daysToAdd += 7;
      }
      
      const nextMeeting = new Date(today);
      nextMeeting.setDate(today.getDate() + daysToAdd);
      return nextMeeting;
    }
    
    if (localRules.meetingFrequency === 'monthly' && localRules.meetingWeek && localRules.meetingDay) {
      // Para reuniões mensais, calcular a próxima ocorrência
      const dayMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
        'friday': 5, 'saturday': 6, 'sunday': 0
      };
      
      const targetDay = dayMap[localRules.meetingDay];
      const targetWeek = localRules.meetingWeek;
      
      // Calcular o primeiro dia do próximo mês
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      
      // Encontrar o primeiro dia da semana desejada no próximo mês
      let firstTargetDay = new Date(nextMonth);
      const firstDayOfMonth = nextMonth.getDay();
      let daysToFirstTarget = targetDay - firstDayOfMonth;
      if (daysToFirstTarget < 0) daysToFirstTarget += 7;
      
      firstTargetDay.setDate(1 + daysToFirstTarget);
      
      // Adicionar as semanas necessárias
      const targetDate = new Date(firstTargetDay);
      targetDate.setDate(firstTargetDay.getDate() + (targetWeek - 1) * 7);
      
      // Se a data calculada já passou, ir para o próximo mês
      if (targetDate <= today) {
        targetDate.setMonth(targetDate.getMonth() + 1);
        const nextNextMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        let nextFirstTargetDay = new Date(nextNextMonth);
        const nextFirstDayOfMonth = nextNextMonth.getDay();
        let nextDaysToFirstTarget = targetDay - nextFirstDayOfMonth;
        if (nextDaysToFirstTarget < 0) nextDaysToFirstTarget += 7;
        
        nextFirstTargetDay.setDate(1 + nextDaysToFirstTarget);
        nextFirstTargetDay.setDate(nextFirstTargetDay.getDate() + (targetWeek - 1) * 7);
        return nextFirstTargetDay;
      }
      
      return targetDate;
    }
    
    return null;
  };

  // Verificar se as regras são válidas
  const isValidRules = () => {
    if (localRules.loanDurationDays < 1) return false;
    // Para reuniões diárias, não precisa validar dia da semana
    if ((localRules.meetingFrequency === 'weekly' || localRules.meetingFrequency === 'biweekly') && !localRules.meetingDay) return false;
    if (localRules.meetingFrequency === 'monthly' && (!localRules.meetingWeek || !localRules.meetingDay)) return false;
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📋 Regras da Organização</Text>
      
      {/* Duração do Empréstimo */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>⏱️ Duração do Empréstimo (dias)</Text>
        <TextInput
          style={styles.input}
          placeholder="30"
          value={localRules.loanDurationDays.toString()}
          onChangeText={(text) => {
            const value = parseInt(text) || 30;
            updateRules({ loanDurationDays: value });
          }}
          keyboardType="numeric"
        />
        <Text style={styles.helpText}>
          Tempo padrão que um livro ficará emprestado
        </Text>
      </View>

             {/* Frequência de Reuniões */}
       <View style={styles.inputContainer}>
         <Text style={styles.inputLabel}>📅 Frequência de Reuniões</Text>
         <TouchableOpacity
           style={styles.comboButton}
           onPress={() => setShowFrequencyModal(true)}
         >
           <Text style={styles.comboButtonText}>
             {frequencyOptions.find(f => f.value === localRules.meetingFrequency)?.label || 'Selecione a frequência'}
           </Text>
           <Text style={styles.comboButtonIcon}>▼</Text>
         </TouchableOpacity>
       </View>

             {/* Configurações específicas baseadas na frequência */}
       {(localRules.meetingFrequency === 'weekly' || localRules.meetingFrequency === 'biweekly') && (
         <View style={styles.inputContainer}>
           <Text style={styles.inputLabel}>📆 Dia da Semana</Text>
           <TouchableOpacity
             style={styles.comboButton}
             onPress={() => setShowDayModal(true)}
           >
             <Text style={styles.comboButtonText}>
               {dayOptions.find(d => d.value === localRules.meetingDay)?.label || 'Selecione um dia'}
             </Text>
             <Text style={styles.comboButtonIcon}>▼</Text>
           </TouchableOpacity>
         </View>
       )}

             {localRules.meetingFrequency === 'monthly' && (
         <>
           <View style={styles.inputContainer}>
             <Text style={styles.inputLabel}>📅 Semana do Mês</Text>
             <TouchableOpacity
               style={styles.comboButton}
               onPress={() => setShowWeekModal(true)}
             >
               <Text style={styles.comboButtonText}>
                 {weekOptions.find(w => w.value === localRules.meetingWeek)?.label || 'Selecione a semana'}
               </Text>
               <Text style={styles.comboButtonIcon}>▼</Text>
             </TouchableOpacity>
           </View>

           <View style={styles.inputContainer}>
             <Text style={styles.inputLabel}>📆 Dia da Semana</Text>
             <TouchableOpacity
               style={styles.comboButton}
               onPress={() => setShowDayModal(true)}
             >
               <Text style={styles.comboButtonText}>
                 {dayOptions.find(d => d.value === localRules.meetingDay)?.label || 'Selecione um dia'}
               </Text>
               <Text style={styles.comboButtonIcon}>▼</Text>
             </TouchableOpacity>
           </View>
         </>
       )}

                                                       {/* Horário da Reunião */}
         {(localRules.meetingFrequency === 'daily' || localRules.meetingFrequency === 'weekly' || localRules.meetingFrequency === 'biweekly' || localRules.meetingFrequency === 'monthly') && (
           <View style={styles.inputContainer}>
             <Text style={styles.inputLabel}>🕐 Horário da Reunião</Text>
             <TextInput
               style={styles.input}
               placeholder="19:00"
               value={localRules.meetingTime || ''}
               onChangeText={(text) => updateRules({ meetingTime: text })}
               keyboardType="default"
             />
             <Text style={styles.helpText}>
               Horário para entrega e devolução de livros
             </Text>
           </View>
         )}

                   {/* Próxima Reunião Calculada */}
          {(localRules.meetingFrequency === 'daily' || localRules.meetingFrequency === 'weekly' || localRules.meetingFrequency === 'biweekly' || localRules.meetingFrequency === 'monthly') && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📅 Próxima Reunião Esperada</Text>
              <View style={styles.calculatedDateContainer}>
                <Text style={styles.calculatedDateText}>
                  {(() => {
                    const nextMeeting = calculateNextMeeting();
                    if (!nextMeeting) return 'Não há reuniões programadas';
                    
                    const today = new Date();
                    const diffTime = nextMeeting.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 0) return 'Hoje';
                    if (diffDays === 1) return 'Amanhã';
                    if (diffDays < 7) return `Em ${diffDays} dias`;
                    if (diffDays < 30) return `Em ${Math.ceil(diffDays / 7)} semanas`;
                    
                    return nextMeeting.toLocaleDateString('pt-BR');
                  })()}
                </Text>
                <Text style={styles.calculatedDateDetail}>
                  {(() => {
                    const nextMeeting = calculateNextMeeting();
                    if (!nextMeeting) return '';
                    return nextMeeting.toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  })()}
                </Text>
              </View>
              <Text style={styles.helpText}>
                Data calculada automaticamente baseada na frequência das reuniões
              </Text>
            </View>
          )}

                                                                                                                               {/* Controle da Próxima Semana - Apenas para Quinzenal */}
           {localRules.meetingFrequency === 'biweekly' && (
             <View style={styles.inputContainer}>
               <Text style={styles.inputLabel}>📅 Próxima Semana</Text>
               <View style={styles.holidayContainer}>
                 <View style={styles.holidayTextContainer}>
                   <Text style={styles.holidayLabel}>📋 Terá Reunião</Text>
                   <Text style={styles.holidayDescription}>
                     Marque se a próxima semana terá reunião quinzenal
                   </Text>
                 </View>
                 <Switch
                   value={nextWeekHasMeeting}
                   onValueChange={setNextWeekHasMeeting}
                   trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
                   thumbColor={nextWeekHasMeeting ? COLORS.white : COLORS.gray[400]}
                 />
               </View>
               {!nextWeekHasMeeting && (
                 <View style={styles.holidayInfoContainer}>
                   <Text style={styles.holidayInfoText}>
                     ⚠️ A próxima semana não terá reunião quinzenal. Semana de folga.
                   </Text>
                 </View>
               )}
             </View>
           )}

             {/* Resumo das Regras */}
       <View style={[styles.summaryContainer, !isValidRules() && styles.summaryContainerError]}>
         <Text style={styles.summaryTitle}>📋 Resumo das Regras</Text>
         <View style={styles.summaryItem}>
           <Text style={styles.summaryLabel}>Empréstimo:</Text>
           <Text style={[styles.summaryValue, localRules.loanDurationDays < 1 && styles.errorText]}>
             {localRules.loanDurationDays} dias
           </Text>
         </View>
         <View style={styles.summaryItem}>
           <Text style={styles.summaryLabel}>Reuniões:</Text>
           <Text style={styles.summaryValue}>{getFrequencyText()}</Text>
         </View>
                   {localRules.meetingTime && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Horário:</Text>
              <Text style={styles.summaryValue}>{localRules.meetingTime}</Text>
            </View>
          )}
                     {(() => {
             const nextMeeting = calculateNextMeeting();
             if (!nextMeeting) return null;
             
             const today = new Date();
             const diffTime = nextMeeting.getTime() - today.getTime();
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             
             let displayText = '';
             if (diffDays === 0) displayText = 'Hoje';
             else if (diffDays === 1) displayText = 'Amanhã';
             else if (diffDays < 7) displayText = `Em ${diffDays} dias`;
             else if (diffDays < 30) displayText = `Em ${Math.ceil(diffDays / 7)} semanas`;
             else displayText = nextMeeting.toLocaleDateString('pt-BR');
             
             return (
               <View style={styles.summaryItem}>
                 <Text style={styles.summaryLabel}>Próxima Reunião:</Text>
                 <Text style={styles.summaryValue}>{displayText}</Text>
               </View>
             );
           })()}
                                                                                {localRules.meetingFrequency === 'biweekly' && !nextWeekHasMeeting && (
               <View style={styles.summaryItem}>
                 <Text style={styles.summaryLabel}>Próxima:</Text>
                 <Text style={[styles.summaryValue, styles.holidayStatus]}>🏖️ Semana de Folga</Text>
               </View>
             )}
             <View style={styles.summaryItem}>
               <Text style={styles.summaryLabel}>Usuários:</Text>
               <Text style={styles.summaryValue}>
                 {localRules.requireCompleteUserInfo ? '📋 Informações Completas' : '📝 Informações Básicas'}
               </Text>
             </View>

            {/* Informações Completas dos Usuários */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>👥 Informações dos Usuários</Text>
              <View style={styles.holidayContainer}>
                                 <View style={styles.holidayTextContainer}>
                   <Text style={styles.holidayLabel}>📋 Informações Completas</Text>
                   <Text style={styles.holidayDescription}>
                     Todos da organização verão telefone, endereço e informações adicionais dos usuários
                   </Text>
                 </View>
                <Switch
                  value={localRules.requireCompleteUserInfo}
                  onValueChange={(value) => updateRules({ requireCompleteUserInfo: value })}
                  trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
                  thumbColor={localRules.requireCompleteUserInfo ? COLORS.white : COLORS.gray[400]}
                />
              </View>
                             {localRules.requireCompleteUserInfo && (
                 <View style={styles.holidayInfoContainer}>
                   <Text style={styles.holidayInfoText}>
                     ℹ️ Endereço, telefone e informações adicionais dos usuários ficarão disponíveis para todos da organização
                   </Text>
                 </View>
               )}
            </View>
         {!isValidRules() && (
           <View style={styles.errorContainer}>
             <Text style={styles.errorText}>⚠️ Configure todas as regras obrigatórias</Text>
           </View>
         )}
       </View>

       {/* Modal para seleção de dia da semana */}
       <Modal
         visible={showDayModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowDayModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>Selecione o Dia da Semana</Text>
             <ScrollView style={styles.modalScrollView}>
               {dayOptions.map((option) => (
                 <TouchableOpacity
                   key={option.value}
                   style={styles.modalOption}
                   onPress={() => {
                     updateRules({ meetingDay: option.value as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' });
                     setShowDayModal(false);
                   }}
                 >
                   <Text style={[
                     styles.modalOptionText,
                     localRules.meetingDay === option.value && styles.modalOptionTextActive
                   ]}>
                     {option.label}
                   </Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
             <TouchableOpacity
               style={styles.modalCancelButton}
               onPress={() => setShowDayModal(false)}
             >
               <Text style={styles.modalCancelText}>Cancelar</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

       {/* Modal para seleção de semana do mês */}
       <Modal
         visible={showWeekModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowWeekModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>Selecione a Semana do Mês</Text>
             <ScrollView style={styles.modalScrollView}>
               {weekOptions.map((option) => (
                 <TouchableOpacity
                   key={option.value}
                   style={styles.modalOption}
                   onPress={() => {
                     updateRules({ meetingWeek: option.value as 1 | 2 | 3 | 4 });
                     setShowWeekModal(false);
                   }}
                 >
                   <Text style={[
                     styles.modalOptionText,
                     localRules.meetingWeek === option.value && styles.modalOptionTextActive
                   ]}>
                     {option.label}
                   </Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
             <TouchableOpacity
               style={styles.modalCancelButton}
               onPress={() => setShowWeekModal(false)}
             >
               <Text style={styles.modalCancelText}>Cancelar</Text>
             </TouchableOpacity>
           </View>
         </View>
                       </Modal>

        {/* Modal para seleção de frequência de reuniões */}
        <Modal
          visible={showFrequencyModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFrequencyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione a Frequência de Reuniões</Text>
              <ScrollView style={styles.modalScrollView}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.modalOption}
                    onPress={() => {
                      updateRules({ 
                        meetingFrequency: option.value as 'na' | 'daily' | 'weekly' | 'biweekly' | 'monthly',
                        meetingDay: undefined,
                        meetingWeek: undefined,
                        meetingTime: undefined
                      });
                      setShowFrequencyModal(false);
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      localRules.meetingFrequency === option.value && styles.modalOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowFrequencyModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        
       </View>
     );
   };

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
  },
  helpText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  optionTextActive: {
    color: COLORS.white,
  },
  summaryContainer: {
    backgroundColor: COLORS.gray[50],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  summaryValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  summaryContainerError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  errorText: {
    color: COLORS.error,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  errorContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.error + '20',
    borderRadius: BORDER_RADIUS.sm,
  },
  // Combo box styles
  comboButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  comboButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    flex: 1,
  },
  comboButtonIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  modalCancelButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  // Holiday control styles
  holidayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  holidayTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  holidayLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  holidayDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  holidayInfoContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.warning + '20',
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  holidayInfoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.warning,
    fontWeight: FONT_WEIGHTS.medium,
  },
     holidayStatus: {
     color: COLORS.warning,
     fontWeight: FONT_WEIGHTS.semibold,
   },
       datePickerContainer: {
      marginBottom: SPACING.md,
    },
    calculatedDateContainer: {
      backgroundColor: COLORS.primary + '10',
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.primary + '30',
    },
    calculatedDateText: {
      fontSize: FONT_SIZES.md,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.primary,
      textAlign: 'center',
      marginBottom: SPACING.xs,
    },
    calculatedDateDetail: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      textAlign: 'center',
    },
}); 