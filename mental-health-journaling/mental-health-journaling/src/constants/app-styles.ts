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

  // src/app/(tabs)/journal.tsx
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
    quickReplies: {
      paddingHorizontal: 12,
      paddingBottom: 8,
      gap: 8,
    },
    quickReply: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 16,
      borderWidth: 1,
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
