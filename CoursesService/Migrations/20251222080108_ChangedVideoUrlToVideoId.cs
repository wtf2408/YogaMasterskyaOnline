using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoursesService.Migrations
{
    /// <inheritdoc />
    public partial class ChangedVideoUrlToVideoId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "Lesson");

            migrationBuilder.AddColumn<Guid>(
                name: "VideoId",
                table: "Lesson",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoId",
                table: "Lesson");

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "Lesson",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
