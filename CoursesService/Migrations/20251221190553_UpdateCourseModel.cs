using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoursesService.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCourseModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Url",
                table: "Course",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Course",
                newName: "ImageUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Course",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Course",
                newName: "Name");
        }
    }
}
