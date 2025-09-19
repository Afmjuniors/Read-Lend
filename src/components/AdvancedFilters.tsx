import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { FoldableCard } from './FoldableCard';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import { GENRES, getGenreText } from '../types';

interface FilterState {
  searchQuery: string;
  selectedGenres: number[];
  selectedStatuses: number[];
  selectedOrganizations: number[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  organizations: Array<{ id: number; name: string }>;
  isExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  organizations,
  isExpanded = false,
  onToggle,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      selectedGenres: [],
      selectedStatuses: [1], // Manter apenas disponíveis como padrão
      selectedOrganizations: [],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleGenre = (genreId: number) => {
    const newGenres = localFilters.selectedGenres.includes(genreId)
      ? localFilters.selectedGenres.filter(id => id !== genreId)
      : [...localFilters.selectedGenres, genreId];
    updateFilters({ selectedGenres: newGenres });
  };

  const toggleStatus = (statusId: number) => {
    const newStatuses = localFilters.selectedStatuses.includes(statusId)
      ? localFilters.selectedStatuses.filter(id => id !== statusId)
      : [...localFilters.selectedStatuses, statusId];
    updateFilters({ selectedStatuses: newStatuses });
  };

  const toggleOrganization = (orgId: number) => {
    const newOrganizations = localFilters.selectedOrganizations.includes(orgId)
      ? localFilters.selectedOrganizations.filter(id => id !== orgId)
      : [...localFilters.selectedOrganizations, orgId];
    updateFilters({ selectedOrganizations: newOrganizations });
  };

  const hasActiveFilters = 
    localFilters.searchQuery.trim() !== '' ||
    localFilters.selectedGenres.length > 0 ||
    localFilters.selectedStatuses.length > 0 ||
    localFilters.selectedOrganizations.length > 0;

  const activeFiltersCount = [
    localFilters.searchQuery.trim() !== '' ? 1 : 0,
    localFilters.selectedGenres.length,
    localFilters.selectedStatuses.length,
    localFilters.selectedOrganizations.length,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <FoldableCard
      title="🔍 Filtros Avançados"
      subtitle="Filtre livros de outros usuários"
      icon="🔍"
      initiallyExpanded={isExpanded}
      onToggle={onToggle}
      headerColor={COLORS.info}
      showBadge={hasActiveFilters}
      badgeText={`${activeFiltersCount} ativo${activeFiltersCount !== 1 ? 's' : ''}`}
      badgeColor={COLORS.warning}
    >
      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <Text style={styles.filterSectionTitle}>🔎 Pesquisa</Text>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar livros..."
            value={localFilters.searchQuery}
            onChangeText={(text) => updateFilters({ searchQuery: text })}
          />
          {localFilters.searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => updateFilters({ searchQuery: '' })}
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros por Gênero */}
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>📚 Gêneros</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChipsContainer}>
            {GENRES.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={[
                  styles.filterChip,
                  localFilters.selectedGenres.includes(genre.id) && styles.filterChipActive
                ]}
                onPress={() => toggleGenre(genre.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  localFilters.selectedGenres.includes(genre.id) && styles.filterChipTextActive
                ]}>
                  {genre.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Filtros por Status */}
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>📊 Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChipsContainer}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                localFilters.selectedStatuses.includes(1) && styles.filterChipActive
              ]}
              onPress={() => toggleStatus(1)}
            >
              <Text style={[
                styles.filterChipText,
                localFilters.selectedStatuses.includes(1) && styles.filterChipTextActive
              ]}>
                Disponível
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                localFilters.selectedStatuses.includes(2) && styles.filterChipActive
              ]}
              onPress={() => toggleStatus(2)}
            >
              <Text style={[
                styles.filterChipText,
                localFilters.selectedStatuses.includes(2) && styles.filterChipTextActive
              ]}>
                Emprestado
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                localFilters.selectedStatuses.includes(3) && styles.filterChipActive
              ]}
              onPress={() => toggleStatus(3)}
            >
              <Text style={[
                styles.filterChipText,
                localFilters.selectedStatuses.includes(3) && styles.filterChipTextActive
              ]}>
                Reservado
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Filtros por Organização */}
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>🏢 Organizações</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChipsContainer}>
            {organizations?.map((org) => (
              <TouchableOpacity
                key={org.id}
                style={[
                  styles.filterChip,
                  localFilters.selectedOrganizations.includes(org.id) && styles.filterChipActive
                ]}
                onPress={() => toggleOrganization(org.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  localFilters.selectedOrganizations.includes(org.id) && styles.filterChipTextActive
                ]}>
                  {org.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Botão Limpar Filtros */}
      {hasActiveFilters && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={clearFilters}
        >
          <Text style={styles.clearFiltersText}>🔄 Limpar Todos os Filtros</Text>
        </TouchableOpacity>
      )}
    </FoldableCard>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: SPACING.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  clearSearchButton: {
    padding: SPACING.sm,
  },
  clearSearchText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
  },
  filterSection: {
    marginBottom: SPACING.md,
  },
  filterSectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  filterChip: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  clearFiltersButton: {
    backgroundColor: COLORS.warning,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  clearFiltersText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
}); 