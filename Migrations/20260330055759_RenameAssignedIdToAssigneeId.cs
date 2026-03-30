using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class RenameAssignedIdToAssigneeId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Task_Users_AssignedId",
                table: "Task");

            migrationBuilder.RenameColumn(
                name: "AssignedId",
                table: "Task",
                newName: "AssigneeId");

            migrationBuilder.RenameIndex(
                name: "IX_Task_AssignedId",
                table: "Task",
                newName: "IX_Task_AssigneeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Task_Users_AssigneeId",
                table: "Task",
                column: "AssigneeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Task_Users_AssigneeId",
                table: "Task");

            migrationBuilder.RenameColumn(
                name: "AssigneeId",
                table: "Task",
                newName: "AssignedId");

            migrationBuilder.RenameIndex(
                name: "IX_Task_AssigneeId",
                table: "Task",
                newName: "IX_Task_AssignedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Task_Users_AssignedId",
                table: "Task",
                column: "AssignedId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
