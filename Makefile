.PHONY: main.pdf

main.pdf:
	-pdflatex main
	-bibtex main
	-pdflatex main
	-pdflatex main
