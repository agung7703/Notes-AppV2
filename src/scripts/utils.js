class Utils {
  constructor() {
    this.baseUrl = "https://notes-api.dicoding.dev/v2";
    this.form = null;
  }

  setFormInstance(formInstance) {
    this.form = formInstance;
  }

  async getNotes() {
    try {
      const response = await fetch(`${this.baseUrl}/notes`);
      const responseJson = await response.json();
      if (!response.ok) {
        console.error(
          `Gagal mengambil catatan. Status: ${response.status} ${response.statusText}`
        );
        this.showResponseMessage(
          `Gagal mengambil catatan: ${response.status} ${response.statusText}`
        );
        return;
      }
      // console.log("Data JSON dari API:", responseJson);

      if (responseJson.error) {
        // console.error("Error dari API:", responseJson.message);
        this.showResponseMessage(responseJson.message);
        return;
      } else {
        //   console.log("Data catatan berhasil diterima:", responseJson.data);
        return responseJson.data;
      }
    } catch (error) {
      this.showResponseMessage(error);
      console.error("Error saat mengambil catatan:", error);
      return [];
    }
  }

  async getArchivedNotes() {
    try {
      const response = await fetch(`${this.baseUrl}/notes/archived`);
      const responseJson = await response.json();
      if (!response.ok) {
        console.error(
          `Gagal mengambil catatan yang diarsipkan. Status: ${response.status} ${response.statusText}`
        );
        this.showResponseMessage(
          `Gagal mengambil catatan yang diarsipkan: ${response.status} ${response.statusText}`
        );
        return;
      }
      // console.log("Data JSON dari API (Archived):", responseJson);

      if (responseJson.error) {
        // console.error("Error dari API (Archived):", responseJson.message);
        this.showResponseMessage(responseJson.message);
        return;
      } else {
        // console.log(
        //   "Data catatan yang diarsipkan berhasil diterima:",
        //   responseJson.data
        // );
        return responseJson.data;
      }
    } catch (error) {
      this.showResponseMessage(error);
      // console.error("Error saat mengambil catatan yang diarsipkan:", error);
      return [];
    }
  }

  async insertNote(note) {
    try {
      const requestBody = {
        title: note.title,
        body: note.body,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      const response = await fetch(`${this.baseUrl}/notes`, options);
      const responseJson = await response.json();
      this.showResponseMessage(responseJson.message);
      await this.getNotes();
      return { error: false };
    } catch (error) {
      this.showResponseMessage(error);
      console.error("Error saat menambahkan catatan:", error);
      return { error: true, message: error.message };
    }
  }

  async archiveNote(id) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${id}/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const responseJson = await response.json();
      this.showResponseMessage(responseJson.message);
      return { error: false, data: responseJson.data };
    } catch (error) {
      this.showResponseMessage("Gagal mengarsipkan catatan.");
      console.error("Gagal mengarsipkan catatan:", error);
      return { error: true, message: error.message };
    }
  }

  async unarchiveNote(id) {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${id}/unarchive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({})
      });
      const responseJson = await response.json();
      this.showResponseMessage(responseJson.message);
      return { error: false, data: responseJson.data };
    } catch (error) {
      this.showResponseMessage("Gagal mengembalikan catatan.");
      console.error("Gagal mengembalikan catatan:", error);
      return { error: true, message: error.message };
    }
  }

  async updatedNote(note) {
    console.log("Memperbarui catatan dengan:", note);
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          body: note.body,
        }),
      };

      const url = `${this.baseUrl}/notes/${note.id}`;
      // console.log("URL PUT:", url);
      // console.log("Opsi PUT:", options);

      const response = await fetch(url, options);
      const responseJson = await response.json();
      this.showResponseMessage(responseJson.message);
      await this.getNotes();
      return { error: false };
    } catch (error) {
      this.showResponseMessage(error);
      // console.error("Error saat memperbarui catatan:", error);
      return { error: true, message: error.message };
    }
  }

  async removeNote(noteId) {
    try {
      // console.log("Mencoba menghapus catatan dengan ID:", noteId);
      const response = await fetch(`${this.baseUrl}/notes/${noteId}`, {
        method: "DELETE",
      });
      // console.log("Response status delete:", response.status);
      const responseJson = await response.json();
      // console.log("Response JSON delete:", responseJson);
      this.showResponseMessage(responseJson.message);
      return { error: false };
    } catch (error) {
      // console.error("Error saat menghapus catatan:", error);
      this.showResponseMessage(error);
      return { error: true, message: error.message };
    }
  }

  showResponseMessage(message) {
    if (this.form && this.form.showSweetAlert) {
      let icon = "info";
      if (message.toLowerCase().includes("berhasil")) {
        icon = "success";
      } else if (
        message.toLowerCase().includes("gagal") ||
        message instanceof Error
      ) {
        icon = "error";
      }
      this.form.showSweetAlert(icon, message, "");
    } else {
      console.log("Pesan:", message);
      // alert(message);
    }
  }
}

export default Utils;
