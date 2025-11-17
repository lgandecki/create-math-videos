from manim import *

class ExponentialAcceleration(Scene):
    def construct(self):
        # Title
        title = Text("Eksponencjalne przyspieszenie", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create chessboard
        board_size = 8
        square_size = 0.6
        board = VGroup()
        
        # Create individual squares for the chessboard
        squares = []
        for row in range(board_size):
            square_row = []
            for col in range(board_size):
                square = Square(side_length=square_size)
                x_pos = col * square_size - (board_size - 1) * square_size / 2
                y_pos = row * square_size - (board_size - 1) * square_size / 2 - 0.5
                square.move_to([x_pos, y_pos, 0])
                
                # Alternate colors for chessboard pattern
                if (row + col) % 2 == 0:
                    square.set_fill(WHITE, opacity=0.8)
                    square.set_stroke(BLACK, width=2)
                else:
                    square.set_fill(GRAY, opacity=0.8)
                    square.set_stroke(BLACK, width=2)
                
                board.add(square)
                square_row.append(square)
            squares.append(square_row)
        
        self.play(Create(board))
        self.wait(1)
        
        # Show initial squares with small amounts
        intro_text = Text("Początkowo wzrost wydaje się powolny...", font_size=32, color=WHITE)
        intro_text.to_edge(DOWN)
        self.play(Write(intro_text))
        
        # Show first few squares with small grain representations
        for i in range(4):
            square_num = i + 1
            grains = 2 ** i
            
            # Position for the square (row 0, column i)
            square_pos = squares[0][i].get_center()
            
            # Square number label
            square_label = Text(f"Pole {square_num}", font_size=20, color=YELLOW)
            square_label.next_to(squares[0][i], UP, buff=0.1)
            
            # Grain count
            grain_text = Text(f"{grains} ziaren", font_size=16, color=WHITE)
            grain_text.next_to(squares[0][i], DOWN, buff=0.1)
            
            # Visual representation of grains (small dots)
            grain_dots = VGroup()
            max_dots = min(grains, 8)  # Limit visual dots for readability
            for j in range(max_dots):
                dot = Dot(radius=0.03, color=YELLOW)
                # Arrange dots in a small grid within the square
                dot_x = square_pos[0] + (j % 3 - 1) * 0.15
                dot_y = square_pos[1] + (j // 3 - 1) * 0.15
                dot.move_to([dot_x, dot_y, 0])
                grain_dots.add(dot)
            
            self.play(
                FadeIn(square_label),
                FadeIn(grain_text),
                Create(grain_dots)
            )
            self.wait(0.5)
        
        self.wait(2)
        
        # Clear intro elements
        self.play(FadeOut(intro_text))
        
        # Show exponential acceleration
        accel_text = Text("Ale potem wzrost dramatycznie przyspiesza!", font_size=32, color=RED)
        accel_text.to_edge(DOWN)
        self.play(Write(accel_text))
        
        # Key squares to demonstrate exponential growth
        key_squares = [
            (10, 512, [1, 1]),        # Square 10: 512 grains
            (20, 524288, [3, 3]),     # Square 20: 524,288 grains  
            (30, 536870912, [5, 5])   # Square 30: 536,870,912 grains
        ]
        
        for square_num, grains, pos in key_squares:
            # Clear previous elements except board and title
            self.play(*[FadeOut(mob) for mob in self.mobjects if mob not in [title, board]])
            
            # Highlight the target square
            target_square = squares[pos[0]][pos[1]]
            highlight = target_square.copy()
            highlight.set_stroke(YELLOW, width=8)
            highlight.set_fill(YELLOW, opacity=0.3)
            
            self.play(Create(highlight))
            
            # Square information
            square_info = VGroup()
            
            square_label = Text(f"Pole {square_num}", font_size=36, color=YELLOW)
            square_label.to_edge(LEFT).shift(UP * 2)
            square_info.add(square_label)
            
            # Format large numbers with separators
            if grains >= 1000000:
                grain_display = f"{grains:,}".replace(",", " ")
            else:
                grain_display = f"{grains:,}".replace(",", " ")
            
            grain_count = Text(f"{grain_display} ziaren", font_size=28, color=WHITE)
            grain_count.next_to(square_label, DOWN, aligned_edge=LEFT)
            square_info.add(grain_count)
            
            # Mathematical representation
            power = square_num - 1
            math_formula = MathTex(f"2^{{{power}}} = {grain_display}", font_size=24, color=BLUE)
            math_formula.next_to(grain_count, DOWN, aligned_edge=LEFT)
            square_info.add(math_formula)
            
            self.play(Write(square_info))
            
            # Visual representation of grain pile size
            pile_center = target_square.get_center()
            
            if square_num == 10:
                # Small pile
                pile = Circle(radius=0.15, color=YELLOW, fill_opacity=0.7)
                pile.move_to(pile_center)
                pile_text = Text("Mały stosik", font_size=14, color=YELLOW)
                pile_text.next_to(pile, RIGHT, buff=0.1)
                
            elif square_num == 20:
                # Larger pile
                pile = Circle(radius=0.25, color=ORANGE, fill_opacity=0.8)
                pile.move_to(pile_center)
                pile_text = Text("Duży stos", font_size=14, color=ORANGE)
                pile_text.next_to(pile, RIGHT, buff=0.1)
                
            else:  # square_num == 30
                # Overflowing pile
                pile = Circle(radius=0.35, color=RED, fill_opacity=0.9)
                pile.move_to(pile_center)
                overflow1 = Circle(radius=0.1, color=RED, fill_opacity=0.7)
                overflow1.move_to(pile_center + RIGHT * 0.4)
                overflow2 = Circle(radius=0.08, color=RED, fill_opacity=0.7)
                overflow2.move_to(pile_center + LEFT * 0.3 + UP * 0.2)
                pile_group = VGroup(pile, overflow1, overflow2)
                pile = pile_group
                pile_text = Text("Przepełnienie!", font_size=14, color=RED)
                pile_text.next_to(pile, UP, buff=0.1)
            
            self.play(Create(pile))
            self.play(Write(pile_text))
            self.wait(2)
        
        # Final message about exponential growth
        self.play(*[FadeOut(mob) for mob in self.mobjects if mob not in [title, board]])
        
        final_message = VGroup()
        msg1 = Text("Wzrost eksponencjalny nie jest liniowy!", font_size=32, color=RED)
        msg1.move_to(DOWN * 1.5)
        
        msg2 = MarkupText(f'Każdy kolejny krok <span foreground="{RED}">PODWAJA</span> poprzednią wartość!', font_size=28, color=YELLOW)
        msg2.next_to(msg1, DOWN)
        
        final_message.add(msg1, msg2)
        
        self.play(Write(final_message))
        self.wait(3)
        
        # Show the dramatic difference
        comparison = VGroup()
        linear_text = Text("Wzrost liniowy: +1, +1, +1, +1...", font_size=24, color=BLUE)
        linear_text.move_to(UP * 0.5)
        
        expo_text = Text("Wzrost eksponencjalny: ×2, ×2, ×2, ×2...", font_size=24, color=RED)
        expo_text.next_to(linear_text, DOWN, buff=0.5)
        
        comparison.add(linear_text, expo_text)
        
        self.play(FadeOut(final_message))
        self.play(Write(comparison))
        self.wait(3)
        
        self.play(FadeOut(comparison))
        self.wait(1)