# ==============================================================================
# TRIAGE Research Lab — Comprehensive Statistical Analysis Script in R
# Master's Thesis in Hospital Management / Magister Manajemen Rumah Sakit
# Title: Efektivitas Pendampingan Large Language Model dalam Klasifikasi dan
#        Prioritisasi Keluhan Pasien terhadap Waktu Triase dan Ketepatan
#        Penanganan Awal Keluhan di Rumah Sakit.
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Package Dependencies
# ------------------------------------------------------------------------------
required_packages <- c(
  "lme4",        # Linear and Generalized Linear Mixed-Effects Models
  "lmerTest",    # p-values and degrees of freedom for lmer via Satterthwaite
  "emmeans",     # Estimated marginal means and pairwise contrasts
  "effectsize",  # Standardized effect sizes (Cohen's d, odds ratios)
  "irr",         # Inter-rater reliability (Cohen's kappa)
  "ggplot2",     # Publication-grade scientific visualizations
  "dplyr",       # Data manipulation
  "tidyr",       # Tidy data restructuring
  "readr"        # Fast CSV import
)

for (pkg in required_packages) {
  if (!require(pkg, character.only = TRUE)) {
    install.packages(pkg, dependencies = TRUE)
    library(pkg, character.only = TRUE)
  }
}

# ------------------------------------------------------------------------------
# 2. Data Loading & Quality Validation
# ------------------------------------------------------------------------------
# Import data exported directly from TRIAGE Research Lab Reports page
# Expected columns: task_id, participant_id, case_id, method, duration_seconds,
#                   final_category, gold_category, final_priority, gold_priority,
#                   is_high_priority, ai_revised, raw_tlx_score
data_file <- "triage-experiment-observations.csv"

if (file.exists(data_file)) {
  df <- read_csv(data_file)
} else {
  message("Demonstration mode: Generating representative simulated research dataset...")
  set.seed(42)
  n_participants <- 10
  n_cases <- 30
  
  df <- expand.grid(
    participant_id = paste0("P", sprintf("%03d", 1:n_participants)),
    case_id = paste0("CASE-", sprintf("%03d", 1:n_cases))
  ) %>%
    mutate(
      method = rep(c("manual", "ai_assisted"), length.out = n()),
      condition_block = ifelse(method == "manual", 1, 2),
      # Manual: Mean 95s (SD 20s); AI-Assisted: Mean 48s (SD 12s)
      duration_seconds = ifelse(
        method == "manual",
        rnorm(n(), mean = 95, sd = 18),
        rnorm(n(), mean = 48, sd = 10)
      ),
      duration_seconds = pmax(duration_seconds, 15), # Floor at 15s
      # Accuracy: Binary agreement with gold standard
      category_correct = ifelse(
        method == "manual",
        rbinom(n(), 1, 0.82),
        rbinom(n(), 1, 0.88)
      ),
      priority_correct = ifelse(
        method == "manual",
        rbinom(n(), 1, 0.79),
        rbinom(n(), 1, 0.86)
      ),
      is_high_priority = rbinom(n(), 1, 0.25),
      raw_tlx_score = ifelse(
        method == "manual",
        rnorm(n(), mean = 62, sd = 10),
        rnorm(n(), mean = 38, sd = 8)
      )
    )
}

# ------------------------------------------------------------------------------
# 3. Primary Outcome Analysis (H1): Triage Duration (Linear Mixed Model)
# ------------------------------------------------------------------------------
# Log-transform duration to stabilize right-skewness common in reaction/task times
df <- df %>% mutate(log_duration = log(duration_seconds))

# Fit Linear Mixed-Effects Model (LMM)
# Fixed effect: method (manual vs ai_assisted)
# Random intercepts: participant_id (clustering) and case_id (item variation)
lmm_time <- lmer(
  log_duration ~ method + (1 | participant_id) + (1 | case_id),
  data = df
)

cat("\n=======================================================\n")
cat("PRIMARY OUTCOME (H1): LINEAR MIXED MODEL FOR TIME\n")
cat("=======================================================\n")
print(summary(lmm_time))
cat("\nANOVA Table (Type III with Satterthwaite's method):\n")
print(anova(lmm_time))

# Estimated Marginal Means (back-transformed to original seconds scale)
emmeans_time <- emmeans(lmm_time, ~ method, type = "response")
cat("\nEstimated Marginal Mean Durations (seconds):\n")
print(emmeans_time)

# Pairwise contrast and Ratio of Means
contrast_time <- pairs(emmeans_time)
cat("\nPairwise Contrasts (Ratio of Means):\n")
print(contrast_time)

# ------------------------------------------------------------------------------
# 4. Secondary Outcome Analysis (H2): Classification Accuracy (GLMM)
# ------------------------------------------------------------------------------
# Generalized Linear Mixed Model (GLMM with binomial logit link)
glmm_accuracy <- glmer(
  category_correct ~ method + (1 | participant_id) + (1 | case_id),
  data = df,
  family = binomial(link = "logit")
)

cat("\n=======================================================\n")
cat("SECONDARY OUTCOME (H2): GENERALIZED LINEAR MIXED MODEL (ACCURACY)\n")
cat("=======================================================\n")
print(summary(glmm_accuracy))

# Odds Ratio
cat("\nOdds Ratio for Accuracy (AI-Assisted vs Manual):\n")
print(exp(fixef(glmm_accuracy)))

# ------------------------------------------------------------------------------
# 5. Workload Analysis (H3): NASA-TLX
# ------------------------------------------------------------------------------
lmm_tlx <- lmer(
  raw_tlx_score ~ method + (1 | participant_id),
  data = df
)

cat("\n=======================================================\n")
cat("WORKLOAD ASSESSMENT (H3): NASA-TLX MIXED MODEL\n")
cat("=======================================================\n")
print(summary(lmm_tlx))

# ------------------------------------------------------------------------------
# 6. Publication Visualization (Apple-restrained aesthetic)
# ------------------------------------------------------------------------------
theme_apple <- theme_minimal(base_family = "sans") +
  theme(
    plot.title = element_text(size = 14, face = "bold", color = "#1d1d1f"),
    plot.subtitle = element_text(size = 11, color = "#707070"),
    axis.title = element_text(size = 10, face = "bold", color = "#1d1d1f"),
    axis.text = element_text(size = 9, color = "#707070"),
    panel.grid.minor = element_blank(),
    panel.grid.major = element_line(color = "#e6e6e8", linewidth = 0.5),
    legend.position = "none"
  )

p_duration <- ggplot(df, aes(x = method, y = duration_seconds, fill = method)) +
  geom_boxplot(width = 0.4, outlier.alpha = 0.3, color = "#1d1d1f", fill = c("#e6e6e8", "#0071e3")) +
  scale_x_discrete(labels = c("ai_assisted" = "AI-Assisted (LLM)", "manual" = "Manual (Mandiri)")) +
  labs(
    title = "Perbandingan Waktu Triase Keluhan Pasien",
    subtitle = "Distribusi durasi penyelesaian tugas (detik) per kondisi eksperimen",
    x = "Metode Triase",
    y = "Durasi (Detik)"
  ) +
  theme_apple

ggsave("duration_comparison_plot.png", plot = p_duration, width = 7, height = 4.5, dpi = 300)
cat("\nScientific visualization saved to duration_comparison_plot.png\n")
