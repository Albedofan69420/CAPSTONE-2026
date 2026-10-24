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
  }),

  // src/app/professional-profile.tsx
  professionalProfile: StyleSheet.create({
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
    },
    author: {
      fontSize: 14,
      marginTop: 6,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      marginTop: 24,
    },
  }),

  // src/app/professional-certificates.tsx
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
  }),
};
