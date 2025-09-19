import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { BookList } from './BookList';
import { AdvancedFilters } from './AdvancedFilters';
import { QuickActions } from './QuickActions';
import { ProfileHeader } from './ProfileHeader';
import { OrganizationsSection } from './OrganizationsSection';
import { MyBooksSection } from './MyBooksSection';
import { LoanHistorySection } from './LoanHistorySection';
import { Book, User } from '../types';
import { useUserDetails } from '../hooks/useUserDetails';
import { useEffect } from 'react';

interface TabContentProps {
  activeTab: string;
  filteredBooks: Book[];
  myBooks: Book[];
  onBookPress: (book: Book) => void;
  onFiltersChange: (filters: any) => void;
  filters: any;
  organizations: any[];
  user: User;
  onLogout?: () => void;
  onAddBook?: () => void;
  onEditBook?: (book: Book) => void;
  onDeleteBook?: (bookId: number) => void;
  onViewBook?: (book: Book) => void;
  onViewOrganization?: (org: any) => void;
  onCreateOrganization?: () => void;
  onViewLoan?: (loan: any) => void;
  onUpdateProfile?: (updatedUser: Partial<User>) => Promise<void>;
  getNextMeetingInfo?: (organizationId: number) => any;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  filteredBooks,
  myBooks,
  onBookPress,
  onFiltersChange,
  filters,
  organizations,
  user,
  onLogout,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onViewBook,
  onViewOrganization,
  onCreateOrganization,
  onViewLoan,
  onUpdateProfile,
  getNextMeetingInfo,
}) => {
  // Hook para carregar detalhes do usuário
  const userDetailsHook = useUserDetails();

  // Carregar detalhes do usuário quando a aba de perfil for acessada
  useEffect(() => {
    if (activeTab === 'profile') {
      console.log('👤 Aba de perfil acessada, carregando detalhes do usuário...');
      userDetailsHook.loadUserDetails();
    }
  }, [activeTab]);
  const renderBooksTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Biblioteca</Text>
      <Text style={styles.tabSubtitle}>Livros disponíveis de outros usuários</Text>

      <AdvancedFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        organizations={organizations.map(org => ({ id: org.id, name: org.name }))}
        isExpanded={false}
        onToggle={(isExpanded) => console.log('Filters expanded:', isExpanded)}
      />

      <View style={styles.booksSection}>
        <BookList
          books={filteredBooks}
          onBookPress={onBookPress}
          title="📚 Livros Disponíveis"
          emptyMessage="Nenhum livro encontrado com os filtros aplicados"
        />
      </View>
    </View>
  );

  const renderQuickActionsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>⚡ Atualização Rápida</Text>
      <Text style={styles.tabSubtitle}>Gerencie empréstimos e devoluções</Text>
      
      <QuickActions
        loans={[
          {
            id: 1,
            bookId: 1,
            bookTitle: "O Senhor dos Anéis",
            bookImage: "https://picsum.photos/100",
            borrowerName: "João Silva",
            borrowerEmail: "joao@email.com",
            borrowedAt: "2024-01-15",
            dueDate: "2024-02-15",
            isOverdue: false,
          },
          {
            id: 2,
            bookId: 2,
            bookTitle: "1984",
            bookImage: "https://picsum.photos/100",
            borrowerName: "Maria Santos",
            borrowerEmail: "maria@email.com",
            borrowedAt: "2024-01-10",
            dueDate: "2024-02-10",
            isOverdue: true,
          },
        ]}
        returns={[
          {
            id: 3,
            bookId: 3,
            bookTitle: "O Hobbit",
            bookImage: "https://picsum.photos/100",
            borrowerName: "Pedro Costa",
            borrowerEmail: "pedro@email.com",
            borrowedAt: "2024-01-05",
            dueDate: "2024-02-05",
            isOverdue: false,
          },
        ]}
        onMarkAsLoaned={(bookId, borrowerEmail) => {
          console.log('Mark as loaned:', bookId, borrowerEmail);
        }}
        onMarkAsReturned={(bookId) => {
          console.log('Mark as returned:', bookId);
        }}
        onContactBorrower={(email) => {
          console.log('Contact borrower:', email);
        }}
      />
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Notificações</Text>
      <Text style={styles.tabSubtitle}>Suas mensagens e alertas</Text>
      
      <View style={styles.notificationsList}>
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationIcon}>📚</Text>
            <Text style={styles.notificationTitle}>Novo livro disponível</Text>
            <Text style={styles.notificationTime}>2h atrás</Text>
          </View>
          <Text style={styles.notificationMessage}>
            "O Senhor dos Anéis" foi adicionado à biblioteca da organização "Clube de Leitura"
          </Text>
        </View>

        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationIcon}>⏰</Text>
            <Text style={styles.notificationTitle}>Empréstimo vence em 2 dias</Text>
            <Text style={styles.notificationTime}>1 dia atrás</Text>
          </View>
          <Text style={styles.notificationMessage}>
            O livro "1984" deve ser devolvido até 15/01/2024
          </Text>
        </View>
      </View>
    </View>
  );

  const renderOrganizationTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Minhas Organizações</Text>
      <Text style={styles.tabSubtitle}>Gerencie suas organizações</Text>
      
      <View style={styles.organizationsList}>
        {organizations.map((org) => (
          <View key={org.id} style={styles.orgCard}>
            <Text style={styles.orgCardTitle}>{org.name}</Text>
            <Text style={styles.orgCardDescription}>{org.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProfileTab = () => {
    // Usar dados do hook se disponível, senão usar dados padrão
    const userDetails = userDetailsHook.getUser();
    const userOrganizations = userDetailsHook.getOrganizations();
    const userBooks = userDetailsHook.getBooks();
    
    const currentUser = userDetails || user;
    const currentOrganizations = userOrganizations.length > 0 ? userOrganizations : organizations || [];
    const currentBooks = userBooks.length > 0 ? userBooks : myBooks;
    
    // Debug logs
    console.log('🔍 TabContent Profile Debug:');
    console.log('  - userDetails:', userDetails);
    console.log('  - userOrganizations:', userOrganizations);
    console.log('  - userBooks:', userBooks);
    console.log('  - currentOrganizations:', currentOrganizations);
    console.log('  - currentBooks:', currentBooks);

    return (
      <ScrollView style={styles.profileScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContent}>
          {/* Cabeçalho do Perfil - Versão Simplificada */}
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Perfil</Text>
            <Text style={styles.profileSubtitle}>Suas informações pessoais</Text>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileEmail}>{currentUser.email}</Text>
            </View>
          </View>

          {/* Seção de Organizações */}
          <OrganizationsSection
            organizations={currentOrganizations}
            onViewOrganization={onViewOrganization || ((org) => console.log('Ver organização:', org))}
            onCreateOrganization={onCreateOrganization || (() => console.log('Criar organização'))}
            getNextMeetingInfo={getNextMeetingInfo}
          />

        {/* Seção de Livros */}
        <MyBooksSection
          books={currentBooks}
          currentUserId={currentUser.userId}
          onAddBook={onAddBook || (() => console.log('Adicionar livro'))}
          onEditBook={onEditBook || ((book) => console.log('Editar livro:', book))}
          onDeleteBook={onDeleteBook || ((bookId) => console.log('Deletar livro:', bookId))}
          onViewBook={onViewBook || ((book) => console.log('Ver livro:', book))}
        />

        {/* Seção de Histórico de Empréstimos */}
        <LoanHistorySection
          loanHistory={[
            {
              id: 1,
              bookName: 'O Senhor dos Anéis',
              bookAuthor: 'J.R.R. Tolkien',
              borrowerName: 'Maria Silva',
              lenderName: user.name,
              loanDate: '2024-01-15',
              returnDate: '2024-02-15',
              status: 'Active' as const,
              isLent: true,
            },
            {
              id: 2,
              bookName: '1984',
              bookAuthor: 'George Orwell',
              borrowerName: user.name,
              lenderName: 'João Santos',
              loanDate: '2024-01-10',
              returnDate: '2024-02-10',
              status: 'Returned' as const,
              isLent: false,
            },
          ]}
          onViewLoan={onViewLoan || ((loan) => console.log('Ver empréstimo:', loan))}
        />

        {/* Botão de Logout */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={onLogout || (() => console.log('Logout'))}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    );
  };

  switch (activeTab) {
    case 'books':
      return renderBooksTab();
    case 'quick':
      return renderQuickActionsTab();
    case 'notifications':
      return renderNotificationsTab();
    case 'organization':
      return renderOrganizationTab();
    case 'profile':
      return renderProfileTab();
    default:
      return renderBooksTab();
  }
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  tabTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  tabSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  booksSection: {
    flex: 1,
    height: '100%',
    marginTop: SPACING.md,
  },
  notificationsList: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  notificationIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.sm,
  },
  notificationTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    flex: 1,
  },
  notificationTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
  },
  notificationMessage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  organizationsList: {
    flex: 1,
  },
  orgCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  orgCardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  orgCardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },

  profileScrollView: {
    flex: 1,
  },
  profileContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  profileHeader: {
    marginBottom: SPACING.lg,
  },
  profileTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  profileSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  profileInfo: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  profileName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
}); 