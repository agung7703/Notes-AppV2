import "./components/fullNoteModal.js";
import "./components/loading-indikator.js";
import Swal from "sweetalert2";

class Form {
  constructor(utilsInstance) {
    this.utils = utilsInstance;
    document.addEventListener("DOMContentLoaded", () => this.init());
    this.handleNoteAction = this.handleNoteAction.bind(this);
    this.isSubmitting = false;
    this.currentNotes = [];
    this.loadingIndicator = document.querySelector("loading-indicator");
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.show();
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.hide();
    }
  }

  async loadAndRenderNotes(showLoader = true) {
    if (showLoader) {
      this.showLoading();
    }
    let fetchError = false; // Tambahkan flag untuk menandai error fetch
    try {
      const nonArchivedNotes = await this.utils.getNotes();
      const archivedNotes = await this.utils.getArchivedNotes();

      const allNotes = [...archivedNotes, ...nonArchivedNotes].sort((a, b) => {
        if (a.archived && !b.archived) return -1;
        if (!a.archived && b.archived) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      this.renderAllNotes(allNotes);
    } catch (error) {
      console.error("Gagal memuat catatan:", error);
      this.showSweetAlert(
        "error",
        "Gagal Memuat Catatan",
        "Terjadi kesalahan saat memuat data."
      );
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        fetchError = true; // Set flag jika error adalah Failed to fetch
      }
    } finally {
      if (showLoader) {
        this.hideLoading();
      }
      if (!fetchError) {
        // Hanya set timeout jika tidak ada error fetch
        setTimeout(() => this.fetchDataPeriodically(), 5000);
      } else {
        console.warn(
          "Pembaruan data periodik dihentikan karena 'Failed to fetch'."
        );
        this.showSweetAlert(
          "warning",
          "Koneksi Bermasalah",
          "Gagal mengambil data dari server. Pembaruan otomatis dihentikan."
        );
      }
    }
  }

  async fetchDataPeriodically() {
    try {
      await this.loadAndRenderNotes(false);
    } catch (error) {
      console.error("Gagal memperbarui data secara berkala:", error);
      // Penanganan error di sini sudah dilakukan di loadAndRenderNotes
    } finally {
      // setTimeout dipindahkan ke loadAndRenderNotes untuk kontrol error fetch
    }
  }

  init() {
    const noteForm = document.querySelector("#note-form");
    noteForm.addEventListener("submit", (event) => this.handleSubmit(event));
    this.loadAndRenderNotes(); // Tampilkan loading saat inisialisasi (refresh)
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.showLoading(); // Tampilkan loading saat menambah note
    const noteForm = event.target;
    const note = this.getFormData(noteForm);
    let result;

    try {
      if (note.id) {
        result = await this.utils.updatedNote(note);
      } else {
        result = await this.utils.insertNote(note);
      }

      noteForm.reset();
      this.isSubmitting = false;

      if (!result.error) {
        this.loadAndRenderNotes();
        this.showSweetAlert(
          "success",
          "Berhasil",
          note.id ? "Catatan diperbarui!" : "Catatan ditambahkan!"
        );
      } else {
        this.showSweetAlert(
          "error",
          "Gagal",
          result.message || "Terjadi kesalahan."
        );
      }
    } catch (error) {
      console.error("Gagal menyimpan/memperbarui catatan:", error);
      this.showSweetAlert(
        "error",
        "Gagal",
        "Terjadi kesalahan saat menyimpan catatan."
      );
    } finally {
      this.hideLoading(); // Sembunyikan loading setelah menambah note selesai
    }
  }

  getFormData(form) {
    const inputNoteId = form.elements["note-id"];
    const inputNotesTitle = form.elements["note-title"];
    const inputNotesBody = form.elements["note-body"];

    return {
      id: inputNoteId ? inputNoteId.value : "",
      title: inputNotesTitle ? inputNotesTitle.value : "",
      body: inputNotesBody ? inputNotesBody.value : "",
    };
  }

  renderAllNotes(data) {
    this.currentNotes = data;
    const listNotesElement = document.querySelector("#notes-data");
    listNotesElement.innerHTML = "";

    if (data && Array.isArray(data) && data.length > 0) {
      const sortedData = [...data].sort((a, b) => {
        if (a.archived && !b.archived) {
          return -1;
        }
        if (!a.archived && b.archived) {
          return 1;
        }
        return 0;
      });

      sortedData.forEach((note) => {
        const maxTitleLength = 20;
        const maxBodyLength = 50;

        const truncatedTitle =
          note.title.length > maxTitleLength
            ? note.title.substring(0, maxTitleLength) + "..."
            : note.title;

        const truncatedBody =
          note.body.length > maxBodyLength
            ? note.body.substring(0, maxBodyLength) + "..."
            : note.body;

        const noteItem = document.createElement("div");
        noteItem.classList.add("note-list__item");
        noteItem.dataset.noteid = note.id;
        noteItem.dataset.noteArchived = note.archived;
        noteItem.dataset.noteCreatedAt = note.createdAt;
        noteItem.innerHTML = `
          <h3 class="note__title">${truncatedTitle}</h3>
          <p class="note__body">${truncatedBody}</p>
          <div class="button-action">
            <button class="btn btn--archive" data-noteid="${note.id}">
              <i class="ri-bookmark-fill archived-icon-${note.id} ${
          note.archived ? "active" : ""
        }"></i>
              <i class="ri-bookmark-line non-archived-icon-${note.id} ${
          !note.archived ? "active" : ""
        }"></i>
            </button>
            </button>
            <button class="edit__button"><i class="ri-edit-2-line"></i></button>
            <button class="delete__button"><i class="ri-delete-bin-line"></i></button>
          </div>
        `;
        listNotesElement.appendChild(noteItem);
      });
    } else {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Belum ada catatan.";
      listNotesElement.appendChild(emptyMessage);
      console.log("Tidak ada data catatan untuk ditampilkan.");
    }
    listNotesElement.addEventListener("click", this.handleNoteAction);
  }

  handleNoteAction(event) {
    const target = event.target;
    const archiveButton = target.closest(".btn--archive");
    const noteItem = target.closest(".note-list__item");

    if (noteItem && !target.closest(".button-action")) {
      this.displayFullNote(noteItem);
    } else if (target.classList.contains("edit__button") && noteItem) {
      this.editNote(noteItem);
    } else if (target.classList.contains("delete__button") && noteItem) {
      const noteId = noteItem.dataset.noteid;
      this.deleteNote(noteId);
    } else if (archiveButton && noteItem) {
      const noteId = archiveButton.dataset.noteid;
      const currentArchivedStatus = noteItem.dataset.noteArchived === "true";
      this.toggleArchiveStatus(noteId, currentArchivedStatus, noteItem);
    }
  }

  async toggleArchiveStatus(noteId, isCurrentlyArchived, noteItem) {
    // Tidak menampilkan loading saat mengarsipkan/unarsipkan
    const archive = !isCurrentlyArchived;
    let result;

    try {
      if (archive) {
        result = await this.utils.archiveNote(noteId);
      } else {
        result = await this.utils.unarchiveNote(noteId);
      }

      if (!result.error) {
        this.loadAndRenderNotes(false); // Perbarui UI tanpa menampilkan loader
        this.showSweetAlert(
          "success",
          "Berhasil",
          archive ? "Catatan diarsipkan!" : "Catatan diunarsipkan!"
        );
      } else {
        this.showSweetAlert(
          "error",
          "Gagal",
          result.message || "Terjadi kesalahan saat mengarsipkan."
        );
      }
    } catch (error) {
      console.error("Gagal mengarsipkan/unarsipkan catatan:", error);
      this.showSweetAlert(
        "error",
        "Gagal",
        "Terjadi kesalahan saat mengarsipkan/unarsipkan."
      );
    } finally {
      // Tidak menyembunyikan loading di sini
    }
  }

  displayFullNote(noteItem) {
    if (noteItem) {
      const noteId = noteItem.dataset.noteid;
      const noteToDisplay = this.currentNotes.find(
        (note) => note.id === noteId
      );
      const fullNoteModal = document.querySelector("full-note-modal");

      if (noteToDisplay && fullNoteModal) {
        fullNoteModal.openModal(noteToDisplay.title, noteToDisplay.body);
      } else {
        console.error(
          `Catatan dengan ID ${noteId} tidak ditemukan di data lokal atau elemen modal tidak ditemukan.`
        );
      }
    } else {
      console.error(
        "Elemen note-list__item tidak ditemukan untuk menampilkan catatan lengkap."
      );
    }
  }

  editNote(noteItem) {
    if (noteItem) {
      const noteId = noteItem.dataset.noteid;
      console.log(`Edit note with ID: ${noteId}`);
      const noteToEdit = this.currentNotes.find((note) => note.id === noteId);

      if (noteToEdit) {
        console.log("Mengisi form dengan:", noteToEdit.title, noteToEdit.body);
        document.getElementById("note-title").value = noteToEdit.title;
        document.getElementById("note-body").value = noteToEdit.body;

        const hiddenInput = document.getElementById("note-id");
        if (hiddenInput) {
          hiddenInput.value = noteToEdit.id;
        } else {
          console.error(
            'Elemen dengan ID "note-id" tidak ditemukan (seharusnya ada di HTML).'
          );
        }
      } else {
        console.error(
          `Catatan dengan ID ${noteId} tidak ditemukan di data lokal.`
        );
      }
    } else {
      console.error("Elemen note-list__item tidak ditemukan untuk edit.");
    }
  }

  async deleteNote(noteId) {
    this.showLoading(); // Tampilkan loading saat menghapus note
    try {
      const result = await this.utils.removeNote(noteId);
      if (!result.error) {
        this.loadAndRenderNotes();
        this.showSweetAlert("success", "Berhasil", "Catatan berhasil dihapus!");
      } else {
        this.showSweetAlert(
          "error",
          "Gagal",
          result.message || "Terjadi kesalahan saat menghapus."
        );
      }
    } catch (error) {
      console.error("Gagal menghapus catatan:", error);
      this.showSweetAlert(
        "error",
        "Gagal",
        "Terjadi kesalahan saat menghapus catatan."
      );
    } finally {
      this.hideLoading(); // Sembunyikan loading setelah menghapus note selesai
    }
  }

  showSweetAlert(icon, title, text) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

export default Form;
