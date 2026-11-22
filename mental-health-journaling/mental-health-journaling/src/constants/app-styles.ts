import { StyleSheet } from "react-native";

export const appStyles = {
  // src/app/(tabs)/index.tsx
  inicio: StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 110,
      gap: 24,
    },
    button: {
      height: 48,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "70%",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    // Separa el botón del diario de la sección de seguimiento
    sectionHeader: {
      marginTop: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    sectionSubtitle: {
      fontSize: 14,
      marginTop: 2,
    },
    nextAppointment: {
      gap: 10,
    },
    // La lista llega hasta los bordes de la pantalla, compensando el padding de scrollContent
    articleList: {
      marginHorizontal: -16,
    },
    articleListContent: {
      paddingHorizontal: 16,
      gap: 12,
    },
    articleCard: {
      width: 220,
      borderRadius: 16,
      overflow: "hidden",
    },
    articleImage: {
      height: 120,
      alignItems: "center",
      justifyContent: "center",
    },
    articleInfo: {
      padding: 12,
      gap: 4,
    },
    articleTitle: {
      fontSize: 15,
      fontWeight: "700",
    },
    articleSubtitle: {
      fontSize: 13,
    },
  }),

  // src/components/emotion-donut.tsx
  emotionDonut: StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 16,
      gap: 16,
    },
    chart: {
      alignItems: "center",
      justifyContent: "center",
    },
    center: {
      position: "absolute",
      alignItems: "center",
    },
    centerEmoji: {
      fontSize: 34,
    },
    centerValue: {
      fontSize: 22,
      fontWeight: "700",
    },
    centerLabel: {
      fontSize: 13,
    },
    legend: {
      gap: 4,
    },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    swatch: {
      width: 12,
      height: 12,
      borderRadius: 3,
    },
    legendLabel: {
      flex: 1,
      fontSize: 15,
    },
    legendValue: {
      fontSize: 14,
      fontVariant: ["tabular-nums"],
    },
    empty: {
      fontSize: 14,
      textAlign: "center",
      paddingVertical: 24,
    },
  }),

  // src/app/journal.tsx
  journal: StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 15,
    },
    scrollContent: {
      gap: 10,
      paddingBottom: 30,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    closeButton: {
      fontSize: 30,
      fontWeight: "400",
      width: 35,
      textAlign: "center",
    },
    headerDate: {
      fontSize: 15,
      fontWeight: "600",
      textAlign: "center",
    },
    headerSpacer: {
      width: 35,
    },
    emotionSection: {
      marginTop: 10,
      marginBottom: 10,
    },
    shareCard: {
      padding: 14,
      borderRadius: 14,
      gap: 10,
      marginBottom: 4,
    },
    shareHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    shareInfo: {
      flex: 1,
      gap: 5,
    },
    shareTitle: {
      fontSize: 14,
      fontWeight: "700",
    },
    shareDescription: {
      fontSize: 12,
      lineHeight: 17,
    },
    shareStatus: {
      fontSize: 12,
      fontWeight: "700",
    },
    fieldSection: {
      gap: 10,
      marginTop: 15,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 8,
    },
    textArea: {
      minHeight: 110,
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      fontSize: 14,
    },
    row: {
      flexDirection: "row",
      gap: 12,
      marginTop: 15,
    },
    column: {
      flex: 1,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 10,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  }),

  // src/app/(tabs)/explore.tsx
  profesionales: StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 16,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 20,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      borderRadius: 24,
      paddingHorizontal: 16,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    filterBadge: {
      position: "absolute",
      top: 5,
      right: 5,
      width: 9,
      height: 9,
      borderRadius: 5,
    },
    list: {
      gap: 12,
      paddingBottom: 110,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 16,
      gap: 14,
    },
    photo: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    cardInfo: {
      flex: 1,
      gap: 4,
    },
    name: {
      fontSize: 16,
      fontWeight: "700",
    },
    profession: {
      fontSize: 14,
    },
    // Ícono de usuario mientras los profesionales no tengan foto
    photoPlaceholder: {
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: 15,
      textAlign: "center",
      marginTop: 32,
    },
  }),

  // src/app/(tabs)/explore.tsx: profesional vinculado del paciente
  psicologoVinculado: StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 16,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 90,
    },
    emptyIcon: {
      width: 76,
      height: 76,
      borderRadius: 38,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    emptyTitle: {
      fontSize: 19,
      fontWeight: "700",
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      lineHeight: 21,
      textAlign: "center",
      maxWidth: 310,
    },
    primaryButton: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 22,
      borderRadius: 22,
      marginTop: 8,
    },
    primaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    content: {
      paddingBottom: 120,
      gap: 18,
    },
    profileCard: {
      alignItems: "center",
      padding: 22,
      borderRadius: 20,
      gap: 6,
    },
    avatar: {
      width: 104,
      height: 104,
      borderRadius: 52,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      marginBottom: 5,
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    name: {
      fontSize: 21,
      fontWeight: "700",
      textAlign: "center",
    },
    specialty: {
      fontSize: 14,
      textAlign: "center",
    },
    activeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 14,
      marginTop: 7,
    },
    activeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    activeText: {
      fontSize: 12,
      fontWeight: "700",
    },
    infoCard: {
      padding: 16,
      borderRadius: 18,
      gap: 17,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    infoContent: {
      flex: 1,
      gap: 3,
    },
    infoLabel: {
      fontSize: 12,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "600",
    },
    section: {
      gap: 9,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
    },
    descriptionCard: {
      padding: 16,
      borderRadius: 18,
    },
    description: {
      fontSize: 14,
      lineHeight: 21,
    },
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 9,
      padding: 13,
      borderRadius: 14,
      borderWidth: 1,
    },
    noticeText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
    },
  }),

  // src/app/professional-details.tsx
  professionalDetails: StyleSheet.create({
    container: {
      flex: 1,
    },
    topBar: {
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 32,
    },
    header: {
      alignItems: "center",
      gap: 8,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    avatarClip: {
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    name: {
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
    },
    specialty: {
      fontSize: 16,
      textAlign: "center",
    },
    stars: {
      flexDirection: "row",
      gap: 4,
      marginTop: 4,
    },
    ratingText: {
      fontSize: 13,
    },
    // Edad, género, región y comuna, sobre la descripción
    info: {
      alignSelf: "stretch",
      borderRadius: 14,
      padding: 14,
      gap: 10,
      marginTop: 28,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    infoLabel: {
      width: 64,
      fontSize: 14,
    },
    infoValue: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
    },
    // Con el bloque de datos encima, la descripción necesita menos separación
    descriptionAfterInfo: {
      marginTop: 20,
    },
    loading: {
      marginTop: 32,
    },
    // El marginTop deja el espacio en blanco que separa la descripción de la cabecera
    description: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "left",
      alignSelf: "stretch",
      marginTop: 35,
    },
    notFound: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 32,
    },
    // Botón "Solicitar cita" bajo la descripción
    button: {
      alignSelf: "stretch",
      flexDirection: "row",
      gap: 8,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 28,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
  }),

  // src/app/(tabs)/perfil.tsx
  perfil: StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 110,
    },
    header: {
      alignItems: "center",
      gap: 12,
      marginBottom: 32,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: "center",
      justifyContent: "center",
    },
    // Foto editable del profesional (src/app/professional/(tabs)/profile.tsx)
    avatarWrapper: {
      width: 120,
      height: 120,
    },
    avatarClip: {
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    avatarLoading: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    editBadge: {
      position: "absolute",
      right: 2,
      bottom: 2,
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 3,
      alignItems: "center",
      justifyContent: "center",
    },
    changePhoto: {
      fontSize: 15,
      fontWeight: "600",
    },
    name: {
      fontSize: 22,
      fontWeight: "700",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 12,
    },
    list: {
      gap: 12,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      gap: 14,
    },
    cardInfo: {
      flex: 1,
      gap: 2,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    cardSubtitle: {
      fontSize: 13,
    },
    button: {
      height: 48,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "70%",
      marginTop: 32,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
  }),

  // src/app/privacy-security.tsx
  privacidad: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    backSpace: {
      width: 44,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
      gap: 28,
    },
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: 14,
    },
    noticeText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    section: {
      gap: 10,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
    },
    list: {
      gap: 10,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      borderRadius: 16,
      gap: 12,
    },
    icon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
    },
    cardInfo: {
      flex: 1,
      gap: 3,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "700",
    },
    cardDescription: {
      fontSize: 13,
      lineHeight: 18,
    },
    soon: {
      fontSize: 11,
      fontWeight: "600",
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 10,
      overflow: "hidden",
    },
  }),

  // src/app/filters.tsx
  filtros: StyleSheet.create({
    container: {
      flex: 1,
    },
    // Misma cabecera que journal.tsx: X a la izquierda y título centrado
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 15,
      marginBottom: 12,
    },
    closeButton: {
      fontSize: 30,
      fontWeight: "400",
      width: 35,
      textAlign: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    headerSpacer: {
      width: 35,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      gap: 20,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
    },
    clearButton: {
      height: 48,
      paddingHorizontal: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    clearButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    applyButton: {
      flex: 1,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: "700",
    },
  }),

  // src/components/dropdown.tsx
  dropdown: StyleSheet.create({
    container: {
      gap: 8,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
    },
    field: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: 14,
      gap: 8,
    },
    value: {
      flex: 1,
      fontSize: 15,
    },
    options: {
      borderRadius: 10,
      borderWidth: 1,
      overflow: "hidden",
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    optionText: {
      fontSize: 15,
    },
  }),

  // src/app/personal-data.tsx
  datosPersonales: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
      gap: 36,
    },
    section: {
      gap: 14,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    field: {
      gap: 6,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      fontSize: 16,
    },
    inputDisabled: {
      opacity: 0.5,
    },
    // Descripción profesional (solo para profesionales)
    textArea: {
      minHeight: 160,
      paddingTop: 12,
      paddingBottom: 12,
    },
    counter: {
      fontSize: 12,
      textAlign: "right",
    },
    // Texto bajo un campo (por ejemplo, la edad calculada)
    hint: {
      fontSize: 13,
    },
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      padding: 12,
      borderRadius: 10,
    },
    noticeText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    button: {
      height: 48,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
  }),

  // src/app/admin/index.tsx, verification.tsx y articles.tsx
  admin: StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    header: {
      gap: 4,
      // Separa el subtítulo de las opciones del panel
      marginBottom: 40,
      marginTop: 8,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
    },
    subtitle: {
      fontSize: 15,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    topBarTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    list: {
      gap: 12,
    },
    separator: {
      height: 12,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      gap: 14,
    },
    cardInfo: {
      flex: 1,
      gap: 4,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    cardSubtitle: {
      fontSize: 13,
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    thumbnail: {
      width: 64,
      height: 48,
      borderRadius: 8,
    },
    thumbnailEmpty: {
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      height: 48,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "70%",
      marginTop: 32,
    },
    newButton: {
      marginTop: 0,
      marginBottom: 20,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: 24,
    },
    emptyText: {
      fontSize: 15,
      textAlign: "center",
      lineHeight: 21,
      maxWidth: 280,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    // Filtros de verification.tsx
    filters: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    filterText: {
      fontSize: 14,
      fontWeight: "600",
    },
  }),

  // src/app/admin/verification-detail.tsx
  verificacion: StyleSheet.create({
    container: {
      flex: 1,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    topBarTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    loading: {
      marginTop: 32,
    },
    emptyText: {
      fontSize: 15,
      textAlign: "center",
      marginTop: 32,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 40,
      gap: 12,
    },
    section: {
      borderRadius: 16,
      padding: 16,
      gap: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 4,
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    rowLabel: {
      width: 64,
      fontSize: 14,
    },
    rowValue: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 12,
    },
    document: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 14,
    },
    documentTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
    },
    documentAction: {
      fontSize: 14,
      fontWeight: "700",
    },
    actions: {
      gap: 12,
      marginTop: 20,
    },
    field: {
      gap: 6,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
    input: {
      minHeight: 96,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
    },
    button: {
      height: 48,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonOutline: {
      borderWidth: 1.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    disabled: {
      opacity: 0.5,
    },
    cancel: {
      alignItems: "center",
      paddingVertical: 8,
    },
  }),

  // src/app/admin/article-editor.tsx
  editorArticulo: StyleSheet.create({
    container: {
      flex: 1,
    },
    centered: {
      alignItems: "center",
      justifyContent: "center",
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    topBarTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 40,
      gap: 20,
    },
    status: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderRadius: 10,
    },
    statusText: {
      flex: 1,
      fontSize: 13,
    },
    field: {
      gap: 6,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      fontSize: 16,
    },
    textArea: {
      minHeight: 200,
      paddingTop: 12,
      paddingBottom: 12,
    },
    imagePicker: {
      aspectRatio: 16 / 9,
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: "dashed",
      overflow: "hidden",
    },
    imagePreview: {
      width: "100%",
      height: "100%",
    },
    imagePlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    imageHint: {
      fontSize: 13,
    },
    actions: {
      gap: 12,
      marginTop: 8,
    },
    button: {
      height: 48,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonOutline: {
      borderWidth: 1.5,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
    },
    deleteText: {
      fontSize: 15,
      fontWeight: "600",
    },
  }),

  // src/app/article.tsx
  articulo: StyleSheet.create({
    container: {
      flex: 1,
    },
    topBar: {
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    loading: {
      marginTop: 32,
    },
    notFound: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 32,
      paddingHorizontal: 24,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 16,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
    },
    author: {
      fontSize: 14,
      marginTop: 6,
      textAlign: "center",
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      marginTop: 24,
    },
  }),

  // src/app/professional/certificates.tsx
  certificados: StyleSheet.create({
    card: {
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      gap: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    cardInfo: {
      flex: 1,
      gap: 2,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "600",
    },
    cardStatus: {
      fontSize: 13,
    },
    pickButton: {
      height: 42,
      borderRadius: 10,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    pickButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    // Estado de la verificación y plazo
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 12,
      borderRadius: 12,
    },
    noticeText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
    },
    // Al abrirse desde el perfil (con barra superior para volver)
    screen: {
      flex: 1,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    topBarTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      padding: 24,
      paddingTop: 8,
    },
  }),

  // src/app/professional/(tabs)/index.tsx y patients.tsx
  professionalTabs: StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      // Deja espacio para la barra inferior flotante
      paddingBottom: 110,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 15,
    },
    patientsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    inviteButton: {
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
    },
    inviteButtonText: {
      fontSize: 14,
      fontWeight: "700",
    },
    // Recordatorio de certificados pendientes en index.tsx
    reminder: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1.5,
      marginTop: 24,
    },
    reminderInfo: {
      flex: 1,
      gap: 4,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    reminderText: {
      fontSize: 14,
      lineHeight: 20,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    emptyText: {
      fontSize: 15,
      textAlign: "center",
      lineHeight: 21,
      maxWidth: 280,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    // Lista de solicitudes y citas en patients.tsx
    listContent: {
      paddingTop: 16,
      gap: 10,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: "700",
      marginTop: 12,
    },
    // Inicio del profesional (index.tsx)
    homeContent: {
      paddingBottom: 24,
      gap: 24,
    },
    homeButton: {
      height: 48,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "70%",
    },
    homeButtonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    homeSection: {
      gap: 10,
    },
    homeEmpty: {
      fontSize: 14,
      lineHeight: 20,
    },
    homeLink: {
      alignSelf: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    homeLinkText: {
      fontSize: 15,
      fontWeight: "700",
    },
  }),

  // src/components/patient-card.tsx
  patientCard: StyleSheet.create({
    card: {
      minHeight: 82,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 18,
      marginBottom: 10,
    },
    inactive: {
      opacity: 0.72,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
    },
    info: {
      flex: 1,
      gap: 4,
    },
    name: {
      fontSize: 16,
      fontWeight: "700",
    },
    email: {
      fontSize: 13,
    },
    side: {
      alignItems: "flex-end",
      gap: 8,
    },
    badge: {
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "700",
    },
  }),

  // src/app/professional/patient-details.tsx
  patientDetails: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 54,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: 24,
    },
    notFound: {
      fontSize: 15,
      textAlign: "center",
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 44,
      gap: 22,
    },
    profile: {
      alignItems: "center",
      gap: 7,
    },
    avatar: {
      width: 94,
      height: 94,
      borderRadius: 47,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    name: {
      fontSize: 23,
      fontWeight: "700",
      textAlign: "center",
    },
    email: {
      fontSize: 14,
      textAlign: "center",
    },
    status: {
      marginTop: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "700",
    },
    infoCard: {
      borderRadius: 16,
      padding: 16,
      gap: 5,
    },
    infoLabel: {
      fontSize: 12,
      fontWeight: "600",
    },
    infoValue: {
      fontSize: 15,
      fontWeight: "600",
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      marginVertical: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: -10,
    },
    features: {
      gap: 10,
    },
    featureCard: {
      minHeight: 76,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      padding: 13,
      borderRadius: 16,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    featureInfo: {
      flex: 1,
      gap: 3,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: "700",
    },
    featureDetail: {
      fontSize: 12,
      lineHeight: 17,
    },
    soon: {
      maxWidth: 58,
      fontSize: 10,
      lineHeight: 13,
      textAlign: "right",
    },
    endButton: {
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1.5,
      marginTop: 4,
    },
    endButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    disabled: {
      opacity: 0.55,
    },
  }),

  // src/app/professional/patient-dashboard.tsx
  patientDashboard: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerInfo: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    headerSubtitle: {
      fontSize: 12,
      maxWidth: 230,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 42,
      gap: 24,
    },
    stats: {
      flexDirection: "row",
      gap: 12,
    },
    statCard: {
      flex: 1,
      minHeight: 92,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      padding: 12,
    },
    statValue: {
      fontSize: 27,
      fontWeight: "700",
    },
    statEmoji: {
      fontSize: 29,
    },
    statLabel: {
      fontSize: 12,
      textAlign: "center",
    },
    section: {
      gap: 11,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    emptyText: {
      fontSize: 14,
      textAlign: "center",
      paddingVertical: 24,
    },
    timeline: {
      gap: 9,
    },
    timelineRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 13,
      borderRadius: 14,
    },
    timelineEmoji: {
      fontSize: 28,
    },
    timelineInfo: {
      flex: 1,
      gap: 2,
    },
    timelineEmotion: {
      fontSize: 15,
      fontWeight: "700",
    },
    timelineDate: {
      fontSize: 12,
    },
  }),

  // src/app/professional/patient-shared-journals.tsx
  sharedJournals: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerInfo: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    headerSubtitle: {
      fontSize: 12,
      maxWidth: 230,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 11,
      paddingHorizontal: 30,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 42,
      gap: 14,
    },
    card: {
      padding: 16,
      borderRadius: 18,
      gap: 15,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
    },
    emoji: {
      fontSize: 31,
    },
    cardHeaderInfo: {
      flex: 1,
      gap: 3,
    },
    date: {
      fontSize: 15,
      fontWeight: "700",
      textTransform: "capitalize",
    },
    emotion: {
      fontSize: 12,
    },
    fields: {
      gap: 14,
    },
    field: {
      gap: 4,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: "600",
    },
    fieldText: {
      fontSize: 14,
      lineHeight: 20,
    },
    emptyRecord: {
      fontSize: 13,
      lineHeight: 19,
    },
  }),

  // src/app/professional/patient-appointments.tsx
  patientAppointments: StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: -8,
    },
    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerInfo: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    headerSubtitle: {
      fontSize: 12,
      maxWidth: 230,
    },
    addButton: {
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 20,
      marginTop: 10,
      marginBottom: 4,
    },
    addButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 11,
      paddingBottom: 50,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    emptyText: {
      fontSize: 14,
      textAlign: "center",
    },
    list: {
      paddingTop: 12,
      paddingBottom: 36,
      gap: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginTop: 10,
      marginBottom: 2,
    },
  }),

  // src/app/professional/appointment-editor.tsx
  appointmentEditor: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
      gap: 25,
    },
    patientName: {
      fontSize: 17,
      fontWeight: "700",
      textAlign: "center",
    },
    dateRow: {
      flexDirection: "row",
      gap: 12,
    },
    dateField: {
      flex: 1.3,
      gap: 8,
    },
    timeField: {
      flex: 0.8,
      gap: 8,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 13,
      fontSize: 16,
    },
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: 14,
    },
    noticeText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    saveButton: {
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    disabled: {
      opacity: 0.55,
    },
  }),

  // src/app/cita.tsx
  appointmentDetails: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
    headerButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: 24,
    },
    emptyText: {
      fontSize: 15,
      textAlign: "center",
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 44,
      gap: 22,
    },
    hero: {
      alignItems: "center",
      gap: 8,
    },
    heroIcon: {
      width: 78,
      height: 78,
      borderRadius: 39,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 3,
    },
    personName: {
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
    },
    status: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "700",
    },
    card: {
      padding: 17,
      borderRadius: 18,
      gap: 19,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
    },
    rowInfo: {
      flex: 1,
      gap: 3,
    },
    label: {
      fontSize: 12,
    },
    value: {
      fontSize: 15,
      fontWeight: "600",
    },
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 9,
      padding: 14,
      borderRadius: 14,
    },
    noticeText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    actions: {
      gap: 12,
    },
    primaryButton: {
      height: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 20,
    },
    primaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    cancelButton: {
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1.5,
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
  }),

  // src/app/professional/invite-patient.tsx
  invitarPaciente: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
      gap: 28,
    },
    intro: {
      alignItems: "center",
      gap: 10,
    },
    heroIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
    },
    infoCard: {
      padding: 16,
      borderRadius: 16,
      gap: 14,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
    },
    primaryButton: {
      height: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 20,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    result: {
      gap: 20,
    },
    successCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
    },
    successInfo: {
      flex: 1,
      gap: 3,
    },
    successTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    successText: {
      fontSize: 13,
    },
    codeSection: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
    codeCard: {
      minHeight: 76,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      borderWidth: 1,
      padding: 12,
    },
    code: {
      fontSize: 28,
      fontWeight: "800",
      letterSpacing: 4,
    },
    hint: {
      fontSize: 12,
      lineHeight: 17,
    },
    secondaryButton: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1,
    },
    secondaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    disabled: {
      opacity: 0.5,
    },
  }),

  // src/app/invitation.tsx
  aceptarInvitacion: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 28,
      paddingBottom: 40,
      gap: 24,
    },
    centerContent: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    intro: {
      alignItems: "center",
      gap: 10,
      marginBottom: 8,
    },
    heroIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
    codeInput: {
      height: 58,
      borderWidth: 1.5,
      borderRadius: 14,
      paddingHorizontal: 16,
      fontSize: 22,
      fontWeight: "700",
      letterSpacing: 4,
      textAlign: "center",
    },
    error: {
      fontSize: 13,
      lineHeight: 18,
      textAlign: "center",
    },
    primaryButton: {
      width: "100%",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: "700",
    },
    secondaryButton: {
      width: "100%",
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1,
    },
    secondaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    disabled: {
      opacity: 0.5,
    },
    confirmation: {
      gap: 20,
    },
    professionalCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 18,
      borderRadius: 16,
    },
    avatar: {
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: "center",
      justifyContent: "center",
    },
    professionalInfo: {
      flex: 1,
      gap: 3,
    },
    professionalLabel: {
      fontSize: 12,
    },
    professionalName: {
      fontSize: 18,
      fontWeight: "700",
    },
    expiration: {
      fontSize: 12,
    },
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: 14,
    },
    noticeText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
  }),

  // src/components/cita-card.tsx
  citaCard: StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 14,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    info: {
      flex: 1,
      gap: 2,
    },
    name: {
      fontSize: 16,
      fontWeight: "700",
    },
    detail: {
      fontSize: 13,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
    },
    // Estado y mensajes por leer, uno sobre el otro
    side: {
      alignItems: "flex-end",
      gap: 6,
    },
    unread: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 6,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
    },
    unreadText: {
      fontSize: 12,
      fontWeight: "700",
    },
  }),

  // src/app/solicitar-cita.tsx
  citas: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
      gap: 10,
    },
    emptyState: {
      alignItems: "center",
      gap: 12,
      marginTop: 64,
      paddingHorizontal: 24,
    },
    emptyText: {
      fontSize: 15,
      textAlign: "center",
    },
    loading: {
      marginTop: 32,
    },
    // Formulario de solicitud
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
      gap: 24,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
    textArea: {
      minHeight: 110,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 12,
      fontSize: 16,
      textAlignVertical: "top",
    },
    counter: {
      fontSize: 12,
      textAlign: "right",
    },
    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      padding: 12,
      borderRadius: 10,
    },
    noticeText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    button: {
      height: 48,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
    },
  }),

  // src/app/cita.tsx (chat de la reserva)
  chat: StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    headerInfo: {
      flex: 1,
    },
    headerName: {
      fontSize: 17,
      fontWeight: "700",
    },
    headerDetail: {
      fontSize: 13,
    },
    // Tarjeta con el estado de la cita y las acciones
    panel: {
      margin: 12,
      padding: 14,
      borderRadius: 14,
      gap: 10,
    },
    panelTitle: {
      fontSize: 15,
      fontWeight: "700",
    },
    panelText: {
      fontSize: 14,
      lineHeight: 20,
    },
    actions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    action: {
      flexGrow: 1,
      height: 40,
      paddingHorizontal: 14,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    actionOutline: {
      borderWidth: 1.5,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "700",
    },
    // Campos para proponer un horario
    proposeRow: {
      flexDirection: "row",
      gap: 8,
    },
    proposeInput: {
      flex: 1,
      height: 42,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      fontSize: 15,
    },
    // Motivo al rechazar o cancelar una cita
    motivoInput: {
      minHeight: 80,
      maxHeight: 140,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 10,
      fontSize: 15,
      textAlignVertical: "top",
    },
    // Mensajes
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
    },
    bubble: {
      maxWidth: "80%",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
    },
    bubbleMine: {
      alignSelf: "flex-end",
      borderBottomRightRadius: 4,
    },
    bubbleOther: {
      alignSelf: "flex-start",
      borderBottomLeftRadius: 4,
    },
    bubbleText: {
      fontSize: 15,
      lineHeight: 20,
    },
    bubbleTime: {
      fontSize: 11,
      marginTop: 2,
      alignSelf: "flex-end",
    },
    systemText: {
      alignSelf: "center",
      fontSize: 12,
      textAlign: "center",
      paddingHorizontal: 24,
      paddingVertical: 4,
    },
    // Aviso de ayuda cuando el texto tiene palabras de riesgo
    crisis: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginHorizontal: 12,
      marginBottom: 8,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1.5,
    },
    crisisText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    // En iOS el contenido de un ScrollView horizontal puede estirarse en el eje vertical.
    // Se fija la altura de esta franja para que las respuestas sigan siendo chips compactos.
    quickRepliesScroll: {
      height: 46,
      flexGrow: 0,
      flexShrink: 0,
    },
    quickReplies: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      gap: 8,
      alignItems: "center",
    },
    quickReply: {
      height: 36,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    quickReplyText: {
      fontSize: 13,
      fontWeight: "600",
    },
    composer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    input: {
      flex: 1,
      minHeight: 42,
      maxHeight: 110,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingTop: 10,
      paddingBottom: 10,
      fontSize: 15,
    },
    send: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
    },
    counter: {
      fontSize: 11,
      textAlign: "right",
      paddingHorizontal: 16,
    },
    closed: {
      fontSize: 13,
      textAlign: "center",
      padding: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    disclaimer: {
      fontSize: 12,
      lineHeight: 16,
      textAlign: "center",
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    notFound: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 32,
    },
  }),
};
