using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VideoService.Migrations
{
    /// <inheritdoc />
    public partial class AddVideoMappingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VideoMappings",
                columns: table => new
                {
                    VideoId = table.Column<string>(type: "text", nullable: false),
                    KeyPrefix = table.Column<string>(type: "text", nullable: false),
                    OriginalFileName = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideoMappings", x => x.VideoId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VideoMappings");
        }
    }
}
