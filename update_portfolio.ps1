# PowerShell script to replace team sections in index.html
$content = Get-Content "d:\Desktop\IETE\IETE_ISF_VBIT\index.html" -Raw

# The new portfolio section with year cards
$newPortfolioSection = @'
    <section id="team" class="portfoio" style="background:url('assets/img/bgg.jpg'); top-center;background-size: cover;">
      <div class="container" data-aos="fade-up">
        <div class="section-title">
          <h2 style="font-size:52px">Portfolio</h2>
          <p style="color: rgba(5, 74, 133, 0.9); font-size: 1.2rem;">Explore our team members by year - Click on any year card to view detailed team information</p>
        </div>

        <!-- Portfolio Year Cards -->
        <div class="portfolio-thumbnails">
          
          <!-- 2025-2026 Card -->
          <a href="portfolio-2025-2026.html" class="portfolio-year-card" data-aos="fade-up" data-aos-delay="100">
            <h3 class="portfolio-year-title">2025-2026</h3>
            <div class="portfolio-member-count">
              <i class="fas fa-users"></i>
              <span>45 Members</span>
            </div>
            <div class="portfolio-view-btn">
              <span>View Team</span>
              <i class="fas fa-arrow-right"></i>
            </div>
          </a>

          <!-- 2023-2024 Card -->
          <a href="portfolio-2023-2024.html" class="portfolio-year-card" data-aos="fade-up" data-aos-delay="200">
            <h3 class="portfolio-year-title">2023-2024</h3>
            <div class="portfolio-member-count">
              <i class="fas fa-users"></i>
              <span>29 Members</span>
            </div>
            <div class="portfolio-view-btn">
              <span>View Team</span>
              <i class="fas fa-arrow-right"></i>
            </div>
          </a>

          <!-- 2022-2023 Card -->
          <a href="portfolio-2022-2023.html" class="portfolio-year-card" data-aos="fade-up" data-aos-delay="300">
            <h3 class="portfolio-year-title">2022-2023</h3>
            <div class="portfolio-member-count">
              <i class="fas fa-users"></i>
              <span>32 Members</span>
            </div>
            <div class="portfolio-view-btn">
              <span>View Team</span>
              <i class="fas fa-arrow-right"></i>
            </div>
          </a>

          <!-- 2021-2022 Card -->
          <a href="portfolio-2021-2022.html" class="portfolio-year-card" data-aos="fade-up" data-aos-delay="400">
            <h3 class="portfolio-year-title">2021-2022</h3>
            <div class="portfolio-member-count">
              <i class="fas fa-users"></i>
              <span>46 Members</span>
            </div>
            <div class="portfolio-view-btn">
              <span>View Team</span>
              <i class="fas fa-arrow-right"></i>
            </div>
          </a>

        </div>
      </div>
    </section><!-- End Portfolio Section -->

                                <!-- ======= Frequently Asked Questions Section ======= --><br><br>


                                <!-- ======= Technical Documents Section ======= -->
'@

# Find the pattern to replace - from the team section start to just before Technical Documents
$pattern = '(?s)<section id="team" class="team section-bg".*?<!-- ======= Technical Documents Section ======= -->'
$replacement = $newPortfolioSection

$newContent = $content -replace $pattern, $replacement

# Write the modified content back
Set-Content "d:\Desktop\IETE\IETE_ISF_VBIT\index.html" -Value $newContent -Encoding UTF8

Write-Host "Portfolio section updated successfully!"
